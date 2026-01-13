"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { BookCard } from "@/components/books/book-card";
import { UpdateProgressDialog } from "@/components/library/update-progress-dialog";
import { UpdateStatusDialog } from "@/components/library/update-status-dialog";
import { BookGridSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserLibrary, useRemoveBookFromLibrary } from "@/hooks/use-user-books";
import type { ReadingStatus } from "@/types/database.types";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { BookOpen, Filter } from "lucide-react";

type SortOption = "recent" | "title" | "author" | "progress";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<ReadingStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [progressDialog, setProgressDialog] = useState<{ open: boolean; book: any } | null>(null);
  const [statusDialog, setStatusDialog] = useState<{ open: boolean; book: any } | null>(null);

  const { data: allBooks, isLoading: isLoadingAll } = useUserLibrary();
  const { data: currentlyReading, isLoading: isLoadingCurrent } = useUserLibrary("currently_reading");
  const { data: wantToRead, isLoading: isLoadingWant } = useUserLibrary("want_to_read");
  const { data: finished, isLoading: isLoadingFinished } = useUserLibrary("finished");
  const { data: onHold, isLoading: isLoadingHold } = useUserLibrary("on_hold");
  const { data: didNotFinish, isLoading: isLoadingDNF } = useUserLibrary("did_not_finish");

  const removeBook = useRemoveBookFromLibrary();

  const getBooks = () => {
    switch (activeTab) {
      case "currently_reading":
        return currentlyReading || [];
      case "want_to_read":
        return wantToRead || [];
      case "finished":
        return finished || [];
      case "on_hold":
        return onHold || [];
      case "did_not_finish":
        return didNotFinish || [];
      default:
        return allBooks || [];
    }
  };

  const sortBooks = (books: any[]) => {
    const sorted = [...books];
    switch (sortBy) {
      case "title":
        return sorted.sort((a, b) => a.book.title.localeCompare(b.book.title));
      case "author":
        return sorted.sort((a, b) => {
          const authorA = a.book.authors?.[0] || "";
          const authorB = b.book.authors?.[0] || "";
          return authorA.localeCompare(authorB);
        });
      case "progress":
        return sorted.sort((a, b) => {
          const progressA = a.book.page_count ? (a.current_page / a.book.page_count) * 100 : 0;
          const progressB = b.book.page_count ? (b.current_page / b.book.page_count) * 100 : 0;
          return progressB - progressA;
        });
      case "recent":
      default:
        return sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
  };

  const books = sortBooks(getBooks());
  const isLoading = isLoadingAll || isLoadingCurrent || isLoadingWant || isLoadingFinished || isLoadingHold || isLoadingDNF;

  const getCounts = () => ({
    all: allBooks?.length || 0,
    currently_reading: currentlyReading?.length || 0,
    want_to_read: wantToRead?.length || 0,
    finished: finished?.length || 0,
    on_hold: onHold?.length || 0,
    did_not_finish: didNotFinish?.length || 0,
  });

  const counts = getCounts();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="py-4">
              <h1 className="text-4xl font-heading font-bold text-primary mb-2" style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                My Library
              </h1>
              <p className="text-lg text-muted-foreground font-accent italic">
                {counts.all} {counts.all === 1 ? "book" : "books"} in your collection
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Updated</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReadingStatus | "all")}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="all">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="currently_reading">
              Reading ({counts.currently_reading})
            </TabsTrigger>
            <TabsTrigger value="want_to_read">
              Want to Read ({counts.want_to_read})
            </TabsTrigger>
            <TabsTrigger value="finished">
              Finished ({counts.finished})
            </TabsTrigger>
            <TabsTrigger value="on_hold">
              On Hold ({counts.on_hold})
            </TabsTrigger>
            <TabsTrigger value="did_not_finish">
              DNF ({counts.did_not_finish})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading && <BookGridSkeleton count={8} />}

            {!isLoading && books.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No books found</p>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all"
                    ? "Start building your library by discovering books"
                    : `You don't have any books in this category yet`}
                </p>
                <Button asChild>
                  <a href="/discover">Discover Books</a>
                </Button>
              </div>
            )}

            {!isLoading && books.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                {books.map((userBook) => (
                  <motion.div key={userBook.id} variants={staggerItem}>
                    <BookCard
                      book={userBook}
                      showProgress={userBook.status === "currently_reading"}
                      onUpdateProgress={() => setProgressDialog({ open: true, book: userBook })}
                      onUpdateStatus={() => setStatusDialog({ open: true, book: userBook })}
                      onRemove={() => removeBook.mutate(userBook.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {progressDialog?.book && (
          <UpdateProgressDialog
            userBookId={progressDialog.book.id}
            currentPage={progressDialog.book.current_page}
            totalPages={progressDialog.book.book.page_count || 0}
            bookTitle={progressDialog.book.book.title}
            open={progressDialog.open}
            onOpenChange={(open) => !open && setProgressDialog(null)}
          />
        )}

        {statusDialog?.book && (
          <UpdateStatusDialog
            userBookId={statusDialog.book.id}
            currentStatus={statusDialog.book.status}
            bookTitle={statusDialog.book.book.title}
            open={statusDialog.open}
            onOpenChange={(open) => !open && setStatusDialog(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}
