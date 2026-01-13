"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Star, BookOpen, Calendar, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GoogleBooksVolume } from "@/types/google-books.types";
import type { ReadingStatus } from "@/types/database.types";
import { useAddBookToLibrary } from "@/hooks/use-user-books";
import { createBook } from "@/app/actions/books";

interface BookDetailsModalProps {
  book: GoogleBooksVolume | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetailsModal({ book, open, onOpenChange }: BookDetailsModalProps) {
  const [status, setStatus] = useState<ReadingStatus>("want_to_read");
  const [isAdding, setIsAdding] = useState(false);
  const addToLibrary = useAddBookToLibrary();

  if (!book) return null;

  const thumbnail = book.image_links?.large || book.image_links?.medium || book.image_links?.thumbnail;
  const authors = book.authors?.join(", ") || "Unknown Author";

  const handleAddToLibrary = async () => {
    setIsAdding(true);
    try {
      // First, ensure the book exists in our database
      const bookResult = await createBook({
        google_books_id: book.google_books_id,
        isbn10: book.isbn10,
        isbn13: book.isbn13,
        title: book.title,
        subtitle: book.subtitle,
        authors: book.authors,
        publisher: book.publisher,
        published_date: book.published_date,
        description: book.description,
        page_count: book.page_count,
        categories: book.categories,
        average_rating: book.average_rating,
        ratings_count: book.ratings_count,
        language: book.language,
        image_links: book.image_links,
      });

      if (bookResult.error) {
        throw new Error(bookResult.error);
      }

      // Then add it to the user's library
      await addToLibrary.mutateAsync({
        bookId: bookResult.data!.id,
        data: {
          status,
          current_page: 0,
          notes: [],
        },
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add book:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
          <DialogDescription>{authors}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            <div className="flex gap-6">
              {thumbnail && (
                <div className="relative w-48 h-72 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={thumbnail}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 space-y-4">
                {book.subtitle && (
                  <p className="text-sm text-muted-foreground">{book.subtitle}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {book.categories?.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {book.publisher && (
                    <div>
                      <p className="font-medium">Publisher</p>
                      <p className="text-muted-foreground">{book.publisher}</p>
                    </div>
                  )}
                  {book.published_date && (
                    <div>
                      <p className="font-medium">Published</p>
                      <p className="text-muted-foreground">{book.published_date}</p>
                    </div>
                  )}
                  {book.page_count && (
                    <div>
                      <p className="font-medium">Pages</p>
                      <p className="text-muted-foreground">{book.page_count}</p>
                    </div>
                  )}
                  {book.language && (
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-muted-foreground uppercase">{book.language}</p>
                    </div>
                  )}
                </div>

                {book.average_rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{book.average_rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({book.ratings_count?.toLocaleString()} ratings)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {book.description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Where to Read Section */}
            <div>
              <h3 className="font-semibold mb-3">Where to Read</h3>
              <div className="grid gap-2">
                {/* Google Books Link */}
                <a
                  href={`https://books.google.com/books?id=${book.google_books_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">View on Google Books</p>
                    <p className="text-xs text-muted-foreground">Preview and purchase options</p>
                  </div>
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* Amazon Search */}
                <a
                  href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + (book.authors[0] || ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.82 12.38c-.11-.07-.24-.13-.39-.13-.39 0-.61.31-.61.62 0 .17.06.31.17.42 1.37 1.34 3.5 1.98 5.42 1.98.2 0 .39 0 .59-.02.51-.05.86-.51.81-1.02-.05-.51-.51-.86-1.02-.81-.15.01-.3.02-.46.02-1.49 0-3.2-.5-4.39-1.54.05.24.08.49.08.75 0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5 1.57-3.5 3.5-3.5c.74 0 1.43.23 2 .62v.01zm-3.3 5.12c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Search on Amazon</p>
                    <p className="text-xs text-muted-foreground">Find purchase options</p>
                  </div>
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* Goodreads Search */}
                <a
                  href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                    <Star className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">View on Goodreads</p>
                    <p className="text-xs text-muted-foreground">Read reviews and ratings</p>
                  </div>
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Add to Library</h3>

              <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                <Label htmlFor="reading-status">Reading Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as ReadingStatus)}
                >
                  <SelectTrigger id="reading-status" className="h-11 w-full bg-background">
                    <SelectValue placeholder="Select reading status" />
                  </SelectTrigger>
                  <SelectContent className="max-w-full">
                    <SelectItem value="want_to_read">Want to Read</SelectItem>
                    <SelectItem value="currently_reading">Currently Reading</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="did_not_finish">Did Not Finish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-muted/30">
                <Button
                  onClick={handleAddToLibrary}
                  disabled={isAdding || addToLibrary.isPending}
                  className="w-full h-11"
                  size="lg"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  {isAdding ? "Adding..." : "Add to Library"}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
