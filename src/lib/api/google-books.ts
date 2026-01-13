import type {
  GoogleBooksSearchResult,
  GoogleBooksVolume,
  BookSearchParams,
  GoogleBooksError,
} from "@/types/google-books.types";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

class GoogleBooksAPIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "GoogleBooksAPIError";
  }
}

async function callGoogleBooksAPI<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const url = new URL(`${GOOGLE_BOOKS_API_URL}${endpoint}`);

  // Add API key
  if (API_KEY) {
    url.searchParams.set("key", API_KEY);
  }

  // Add other params
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new GoogleBooksAPIError(
      errorData.error?.message || "API request failed",
      errorData.error?.code,
      errorData.error?.errors
    );
  }

  return response.json();
}

// Transform Google Books API response to our format
function transformVolume(item: any): GoogleBooksVolume {
  const volumeInfo = item.volumeInfo || {};

  // Convert HTTP image URLs to HTTPS
  const fixImageUrl = (url?: string) => {
    if (!url) return undefined;
    return url.replace('http://', 'https://');
  };

  return {
    google_books_id: item.id,
    title: volumeInfo.title || "Untitled",
    authors: volumeInfo.authors || [],
    description: volumeInfo.description,
    publisher: volumeInfo.publisher,
    published_date: volumeInfo.publishedDate,
    page_count: volumeInfo.pageCount,
    categories: volumeInfo.categories || [],
    average_rating: volumeInfo.averageRating,
    ratings_count: volumeInfo.ratingsCount,
    image_links: volumeInfo.imageLinks ? {
      thumbnail: fixImageUrl(volumeInfo.imageLinks.thumbnail),
      small: fixImageUrl(volumeInfo.imageLinks.small),
      medium: fixImageUrl(volumeInfo.imageLinks.medium),
      large: fixImageUrl(volumeInfo.imageLinks.large),
      extraLarge: fixImageUrl(volumeInfo.imageLinks.extraLarge),
    } : undefined,
    language: volumeInfo.language,
    preview_link: volumeInfo.previewLink,
    info_link: volumeInfo.infoLink,
    canonical_volume_link: volumeInfo.canonicalVolumeLink,
    isbn10: volumeInfo.industryIdentifiers?.find((id: any) => id.type === "ISBN_10")?.identifier,
    isbn13: volumeInfo.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")?.identifier,
  };
}

export const googleBooksAPI = {
  async search(params: BookSearchParams): Promise<GoogleBooksSearchResult> {
    const searchParams: Record<string, string> = {
      q: params.query,
      startIndex: params.startIndex?.toString() || "0",
      maxResults: params.maxResults?.toString() || "20",
    };

    if (params.orderBy) {
      searchParams.orderBy = params.orderBy;
    }

    if (params.langRestrict) {
      searchParams.langRestrict = params.langRestrict;
    }

    if (params.filter) {
      searchParams.filter = params.filter;
    }

    const result = await callGoogleBooksAPI<any>("", searchParams);

    return {
      kind: result.kind,
      totalItems: result.totalItems || 0,
      items: (result.items || []).map(transformVolume),
    };
  },

  /**
   * Get book details by Google Books volume ID
   */
  async getById(volumeId: string): Promise<GoogleBooksVolume> {
    const result = await callGoogleBooksAPI<any>(`/${volumeId}`, {});
    return transformVolume(result);
  },

  /**
   * Search for a book by ISBN
   */
  async getByISBN(isbn: string): Promise<GoogleBooksVolume> {
    const result = await callGoogleBooksAPI<any>("", { q: `isbn:${isbn}` });
    if (!result.items || result.items.length === 0) {
      throw new GoogleBooksAPIError("Book not found", "NOT_FOUND");
    }
    return transformVolume(result.items[0]);
  },

  /**
   * Search books by title
   */
  async searchByTitle(
    title: string,
    options?: Omit<BookSearchParams, "query">
  ): Promise<GoogleBooksSearchResult> {
    return this.search({
      query: `intitle:${title}`,
      ...options,
    });
  },

  /**
   * Search books by author
   */
  async searchByAuthor(
    author: string,
    options?: Omit<BookSearchParams, "query">
  ): Promise<GoogleBooksSearchResult> {
    return this.search({
      query: `inauthor:${author}`,
      ...options,
    });
  },

  /**
   * Search books by subject/category
   */
  async searchBySubject(
    subject: string,
    options?: Omit<BookSearchParams, "query">
  ): Promise<GoogleBooksSearchResult> {
    return this.search({
      query: `subject:${subject}`,
      ...options,
    });
  },

  /**
   * Advanced search with multiple criteria
   */
  async advancedSearch(criteria: {
    title?: string;
    author?: string;
    isbn?: string;
    subject?: string;
    publisher?: string;
    startIndex?: number;
    maxResults?: number;
  }): Promise<GoogleBooksSearchResult> {
    const queryParts: string[] = [];

    if (criteria.title) {
      queryParts.push(`intitle:${criteria.title}`);
    }
    if (criteria.author) {
      queryParts.push(`inauthor:${criteria.author}`);
    }
    if (criteria.isbn) {
      queryParts.push(`isbn:${criteria.isbn}`);
    }
    if (criteria.subject) {
      queryParts.push(`subject:${criteria.subject}`);
    }
    if (criteria.publisher) {
      queryParts.push(`inpublisher:${criteria.publisher}`);
    }

    if (queryParts.length === 0) {
      throw new GoogleBooksAPIError(
        "At least one search criterion is required",
        "INVALID_PARAMS"
      );
    }

    return this.search({
      query: queryParts.join("+"),
      startIndex: criteria.startIndex,
      maxResults: criteria.maxResults,
    });
  },
};

export { GoogleBooksAPIError };
