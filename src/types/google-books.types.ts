export interface GoogleBooksSearchResult {
  totalItems: number;
  items: GoogleBooksVolume[];
}

export interface GoogleBooksVolume {
  google_books_id: string;
  isbn10: string | null;
  isbn13: string | null;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  published_date: string | null;
  description: string | null;
  page_count: number | null;
  categories: string[];
  average_rating: number | null;
  ratings_count: number | null;
  language: string;
  image_links: {
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
}

export interface BookSearchParams {
  query: string;
  startIndex?: number;
  maxResults?: number;
  orderBy?: "relevance" | "newest";
  langRestrict?: string;
  filter?: string;
}

export interface GoogleBooksError {
  error: string;
  code?: string;
  details?: any;
}
