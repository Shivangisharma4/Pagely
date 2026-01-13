import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
const CACHE_TTL = 86400; // 24 hours in seconds

interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
    imageLinks?: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

function getCacheKey(endpoint: string, params: Record<string, string>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return `${endpoint}:${sortedParams}`;
}

function getFromCache(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL * 1000) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCache(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429) {
        // Rate limited - exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

function normalizeBookData(volume: GoogleBooksVolume) {
  const { volumeInfo } = volume;
  const identifiers = volumeInfo.industryIdentifiers || [];

  const isbn10 = identifiers.find((id) => id.type === "ISBN_10")?.identifier;
  const isbn13 = identifiers.find((id) => id.type === "ISBN_13")?.identifier;

  return {
    google_books_id: volume.id,
    isbn10: isbn10 || null,
    isbn13: isbn13 || null,
    title: volumeInfo.title,
    subtitle: volumeInfo.subtitle || null,
    authors: volumeInfo.authors || [],
    publisher: volumeInfo.publisher || null,
    published_date: volumeInfo.publishedDate || null,
    description: volumeInfo.description || null,
    page_count: volumeInfo.pageCount || null,
    categories: volumeInfo.categories || [],
    average_rating: volumeInfo.averageRating || null,
    ratings_count: volumeInfo.ratingsCount || null,
    language: volumeInfo.language || "en",
    image_links: volumeInfo.imageLinks || {},
  };
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const apiKey = Deno.env.get("GOOGLE_BOOKS_API_KEY");

    if (!apiKey) {
      throw new Error("Google Books API key not configured");
    }

    // Initialize Supabase client for auth verification
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "search": {
        const query = url.searchParams.get("q");
        const startIndex = url.searchParams.get("startIndex") || "0";
        const maxResults = url.searchParams.get("maxResults") || "20";

        if (!query) {
          return new Response(
            JSON.stringify({ error: "Query parameter 'q' is required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const cacheKey = getCacheKey("search", {
          q: query,
          startIndex,
          maxResults,
        });
        const cachedData = getFromCache(cacheKey);

        if (cachedData) {
          return new Response(JSON.stringify(cachedData), {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "X-Cache": "HIT",
            },
          });
        }

        const searchUrl = `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(
          query
        )}&startIndex=${startIndex}&maxResults=${maxResults}&key=${apiKey}`;

        const response = await fetchWithRetry(searchUrl, {});

        if (!response.ok) {
          throw new Error(`Google Books API error: ${response.statusText}`);
        }

        const data = await response.json();
        const normalizedData = {
          totalItems: data.totalItems || 0,
          items: (data.items || []).map(normalizeBookData),
        };

        setCache(cacheKey, normalizedData);

        return new Response(JSON.stringify(normalizedData), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-Cache": "MISS",
          },
        });
      }

      case "get": {
        const volumeId = url.searchParams.get("id");

        if (!volumeId) {
          return new Response(
            JSON.stringify({ error: "Volume ID is required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const cacheKey = getCacheKey("get", { id: volumeId });
        const cachedData = getFromCache(cacheKey);

        if (cachedData) {
          return new Response(JSON.stringify(cachedData), {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "X-Cache": "HIT",
            },
          });
        }

        const detailsUrl = `${GOOGLE_BOOKS_API_URL}/${volumeId}?key=${apiKey}`;
        const response = await fetchWithRetry(detailsUrl, {});

        if (!response.ok) {
          throw new Error(`Google Books API error: ${response.statusText}`);
        }

        const data = await response.json();
        const normalizedData = normalizeBookData(data);

        setCache(cacheKey, normalizedData);

        return new Response(JSON.stringify(normalizedData), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-Cache": "MISS",
          },
        });
      }

      case "isbn": {
        const isbn = url.searchParams.get("isbn");

        if (!isbn) {
          return new Response(JSON.stringify({ error: "ISBN is required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const cacheKey = getCacheKey("isbn", { isbn });
        const cachedData = getFromCache(cacheKey);

        if (cachedData) {
          return new Response(JSON.stringify(cachedData), {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "X-Cache": "HIT",
            },
          });
        }

        const isbnUrl = `${GOOGLE_BOOKS_API_URL}?q=isbn:${isbn}&key=${apiKey}`;
        const response = await fetchWithRetry(isbnUrl, {});

        if (!response.ok) {
          throw new Error(`Google Books API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
          return new Response(
            JSON.stringify({ error: "Book not found for ISBN" }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const normalizedData = normalizeBookData(data.items[0]);
        setCache(cacheKey, normalizedData);

        return new Response(JSON.stringify(normalizedData), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-Cache": "MISS",
          },
        });
      }

      default:
        return new Response(
          JSON.stringify({
            error: "Invalid action. Use 'search', 'get', or 'isbn'",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
});
