import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { googleBooksAPI } from "@/lib/api/google-books";
import type { BookSearchParams } from "@/types/google-books.types";

export function useBookSearch(params: BookSearchParams, enabled = true) {
  return useQuery({
    queryKey: ["books", "search", params.query, params.maxResults],
    queryFn: () => googleBooksAPI.search(params),
    enabled: enabled && !!params.query,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useInfiniteBookSearch(
  query: string,
  maxResults = 20,
  enabled = true,
  langRestrict?: string,
  orderBy?: "relevance" | "newest"
) {
  return useInfiniteQuery({
    queryKey: ["books", "search", "infinite", query, maxResults, langRestrict, orderBy],
    queryFn: ({ pageParam = 0 }) =>
      googleBooksAPI.search({
        query,
        startIndex: pageParam,
        maxResults,
        langRestrict,
        orderBy,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentCount = allPages.reduce(
        (sum, page) => sum + page.items.length,
        0
      );
      if (currentCount < lastPage.totalItems) {
        return currentCount;
      }
      return undefined;
    },
    enabled: enabled && !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialPageParam: 0,
  });
}

export function useBookDetails(volumeId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["books", "details", volumeId],
    queryFn: () => googleBooksAPI.getById(volumeId!),
    enabled: enabled && !!volumeId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useBookByISBN(isbn: string | null, enabled = true) {
  return useQuery({
    queryKey: ["books", "isbn", isbn],
    queryFn: () => googleBooksAPI.getByISBN(isbn!),
    enabled: enabled && !!isbn,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useBookSearchByTitle(title: string, enabled = true) {
  return useQuery({
    queryKey: ["books", "search", "title", title],
    queryFn: () => googleBooksAPI.searchByTitle(title),
    enabled: enabled && !!title,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBookSearchByAuthor(author: string, enabled = true) {
  return useQuery({
    queryKey: ["books", "search", "author", author],
    queryFn: () => googleBooksAPI.searchByAuthor(author),
    enabled: enabled && !!author,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
