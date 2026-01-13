"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useUserLibrary } from "@/hooks/use-user-books";
import { searchInLibrary, type SearchFilters } from "@/lib/search";
import { BookCard } from "@/components/books/book-card";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({ query: initialQuery });
  const { data: library } = useUserLibrary();

  // Auto-search when coming from URL parameter
  useEffect(() => {
    if (initialQuery) {
      setFilters({ query: initialQuery });
    }
  }, [initialQuery]);

  const handleSearch = () => {
    setFilters({ ...filters, query });
  };

  const results = library ? searchInLibrary(library, filters) : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-muted-foreground">
            Search your library, notes, and more
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search books, authors, notes..."
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue="books">
          <TabsList>
            <TabsTrigger value="books">
              Books ({results.length})
            </TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-6">
            {results.length === 0 && query && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search query
                  </p>
                </CardContent>
              </Card>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {results.map((userBook) => (
                  <BookCard key={userBook.id} book={userBook} showProgress />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Notes search coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lists" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Lists search coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading search...</p>
        </div>
      </MainLayout>
    }>
      <SearchContent />
    </Suspense>
  );
}
