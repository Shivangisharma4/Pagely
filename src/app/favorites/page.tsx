"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { BookCard } from "@/components/books/book-card";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  // TODO: Fetch user's favorite books
  const favorites: any[] = [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <div>
            <h1 className="text-3xl font-bold">Favorites</h1>
            <p className="text-muted-foreground">
              Your favorite books collection
            </p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground max-w-md">
              Start adding books to your favorites from your library or discover page
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
