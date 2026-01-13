"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { MainLayout } from "@/components/layout/main-layout";
import { SearchBar } from "@/components/search/search-bar";
import { BookCard } from "@/components/books/book-card";
import { BookGridSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useInfiniteBookSearch } from "@/hooks/use-book-search";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { GoogleBooksVolume } from "@/types/google-books.types";
import { createBook } from "@/app/actions/books";
import { addBookToLibrary } from "@/app/actions/user-books";
import { useToast } from "@/hooks/use-toast";

// Lazy load BookDetailsModal for better performance
const BookDetailsModal = dynamic(
  () => import("@/components/books/book-details-modal").then((mod) => ({ default: mod.BookDetailsModal })),
  { ssr: false }
);

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [selectedBook, setSelectedBook] = useState<GoogleBooksVolume | null>(null);
  const [addingBookId, setAddingBookId] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<"relevance" | "newest">("relevance");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const { toast } = useToast();

  // Genre options
  const genres = [
    "All",
    "Fiction",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Fantasy",
    "Thriller",
    "Non-Fiction",
    "Biography",
    "History",
    "Self-Help",
    "Poetry",
  ];

  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteBookSearch(
    searchQuery,
    20,
    hasSearched && !!searchQuery,
    language,
    sortBy
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Auto-load popular books on mount if no query parameter
  useEffect(() => {
    if (!initialQuery && !hasSearched) {
      // Auto-load bestsellers on first visit
      setSearchQuery("bestsellers 2024");
      setHasSearched(true);
    } else if (initialQuery && !hasSearched) {
      // Trigger search automatically from URL param
      setSearchQuery(initialQuery);
      setHasSearched(true);
    }
  }, [initialQuery, hasSearched]);

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    if (genre === "All") {
      setSearchQuery("bestsellers 2024");
    } else {
      setSearchQuery(`subject:${genre.toLowerCase()}`);
    }
    setHasSearched(true);
  };

  const handleSearch = (query: string, filters?: any) => {
    let searchString = query;
    const queryParts: string[] = [];

    // Base query
    if (query.trim()) {
      queryParts.push(query.trim());
    }

    if (filters) {
      // Text-based filters
      if (filters.title) queryParts.push(`intitle:${filters.title}`);
      if (filters.author) queryParts.push(`inauthor:${filters.author}`);
      if (filters.subject) queryParts.push(`subject:${filters.subject}`);
      if (filters.publisher) queryParts.push(`inpublisher:${filters.publisher}`);

      // Genre filter
      if (filters.genre) {
        queryParts.push(`subject:${filters.genre}`);
      }

      // Extract and set language filter
      if (filters.language) {
        setLanguage(filters.language);
      } else {
        setLanguage(undefined);
      }

      // Extract and set sort filter
      if (filters.sortBy) {
        setSortBy(filters.sortBy as "relevance" | "newest");
      } else {
        setSortBy("relevance");
      }

      // TODO: Year range filter - needs custom date filtering logic
      // Google Books API doesn't have direct year range support

      searchString = queryParts.join('+');
    }

    setSearchQuery(searchString);
    setHasSearched(true);
  };

  const handleAddToLibrary = async (book: GoogleBooksVolume) => {
    console.log("📚 Add to Library clicked for:", book.title);
    setAddingBookId(book.google_books_id);

    // Show optimistic feedback immediately
    toast({
      title: "Adding to library...",
      description: `Adding "${book.title}" to your library`,
    });

    try {
      // First, create the book in the database
      const bookData = {
        google_books_id: book.google_books_id,
        title: book.title,
        authors: book.authors || [],
        description: book.description,
        publisher: book.publisher,
        published_date: book.published_date,
        isbn10: book.isbn10,
        isbn13: book.isbn13,
        page_count: book.page_count,
        categories: book.categories || [],
        average_rating: book.average_rating,
        ratings_count: book.ratings_count,
        image_links: book.image_links,
        language: book.language,
        preview_link: book.preview_link,
        info_link: book.info_link,
        canonical_volume_link: book.canonical_volume_link,
      };

      console.log("📖 Creating book in database...", bookData);
      const { data: createdBook, error: bookError } = await createBook(bookData);

      if (bookError) {
        console.error("❌ Book creation error:", bookError);
        throw new Error(bookError);
      }

      if (!createdBook) {
        console.error("❌ No book returned from createBook");
        throw new Error("Failed to create book");
      }

      console.log("✅ Book created successfully:", createdBook.id);

      // Then add it to the user's library
      console.log("📚 Adding to user library...");
      const { error: libraryError } = await addBookToLibrary(createdBook.id, {
        status: "want_to_read",
        current_page: 0,
        notes: [],
      });

      if (libraryError) {
        console.error("❌ Library error:", libraryError);
        if (libraryError === "Book already in library") {
          toast({
            title: "Already in Library",
            description: `"${book.title}" is already in your library`,
            variant: "default",
          });
        } else if (libraryError === "Unauthorized") {
          toast({
            title: "Authentication Required",
            description: "Please log in to add books to your library",
            variant: "destructive",
          });
        } else {
          throw new Error(libraryError);
        }
      } else {
        console.log("✅ Book added to library successfully!");
        toast({
          title: "✓ Success!",
          description: `"${book.title}" has been added to your library`,
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to add book - Full error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add book to library. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setAddingBookId(null);
    }
  };

  const allBooks = data?.pages.flatMap((page) => page.items) || [];
  const totalItems = data?.pages[0]?.totalItems || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Vintage Header */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="py-6">
            <h1 className="text-4xl font-heading font-bold text-primary mb-2" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              Discover Books
            </h1>
            <p className="text-lg text-muted-foreground font-accent italic">
              Search millions of books from Google Books
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>

        {/* Genre Filter Chips */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Browse by Genre</h3>
          <div className="flex gap-2 overflow-x-auto pb-3 scroll-smooth">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => handleGenreSelect(genre)}
                className="whitespace-nowrap min-w-[80px] min-h-[36px] transition-all duration-200 hover:scale-105"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />

        {isError && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Failed to search books"}
            </p>
          </div>
        )}

        {!hasSearched && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground">
              Loading recommended books...
            </p>
          </div>
        )}

        {hasSearched && isLoading && <BookGridSkeleton count={20} />}

        {hasSearched && !isLoading && allBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium">No books found</p>
            <p className="text-muted-foreground">
              Try adjusting your search query or filters
            </p>
          </div>
        )}

        {allBooks.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {totalItems.toLocaleString()} results
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {allBooks.map((book, index) => (
                <motion.div key={`${book.google_books_id}-${index}`} variants={staggerItem}>
                  <BookCard
                    book={book}
                    onClick={() => setSelectedBook(book)}
                    onAddToLibrary={addingBookId === book.google_books_id ? undefined : () => handleAddToLibrary(book)}
                  />
                </motion.div>
              ))}
            </motion.div>

            <BookDetailsModal
              book={selectedBook}
              open={!!selectedBook}
              onOpenChange={(open) => !open && setSelectedBook(null)}
            />

            {hasNextPage && (
              <div ref={ref} className="flex justify-center py-8">
                {isFetchingNextPage ? (
                  <BookGridSkeleton count={5} />
                ) : (
                  <Button onClick={() => fetchNextPage()} variant="outline">
                    Load More
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
