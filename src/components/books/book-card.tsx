"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, BookOpen, MoreVertical, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GoogleBooksVolume } from "@/types/google-books.types";
import type { UserBookWithBook } from "@/types/database.types";

interface BookCardProps {
  book: GoogleBooksVolume | UserBookWithBook;
  variant?: "default" | "compact";
  showProgress?: boolean;
  isFavorite?: boolean;
  onAddToLibrary?: () => void;
  onUpdateStatus?: () => void;
  onUpdateProgress?: () => void;
  onRemove?: () => void;
  onToggleFavorite?: () => void;
  onClick?: () => void;
}

function isUserBook(book: any): book is UserBookWithBook {
  return "user_id" in book && "status" in book;
}

export function BookCard({
  book,
  variant = "default",
  showProgress = false,
  isFavorite = false,
  onAddToLibrary,
  onUpdateStatus,
  onUpdateProgress,
  onRemove,
  onToggleFavorite,
  onClick,
}: BookCardProps) {
  const bookData = isUserBook(book) ? book.book : book;
  const userBookData = isUserBook(book) ? book : null;

  // Use higher quality images - prefer large, then medium, then small, then thumbnail
  const thumbnail = bookData.image_links?.large ||
    bookData.image_links?.medium ||
    bookData.image_links?.small ||
    bookData.image_links?.thumbnail ||
    "/placeholder-book.png";
  const title = bookData.title;
  const authors = bookData.authors?.join(", ") || "Unknown Author";
  const pageCount = bookData.page_count;
  const rating = bookData.average_rating;

  const progress = userBookData
    ? pageCount
      ? (userBookData.current_page / pageCount) * 100
      : 0
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="h-full"
      style={{ willChange: 'transform' }}
    >
      <Card className="h-full flex flex-col overflow-hidden shadow-pages hover:shadow-leather transition-shadow duration-150 texture-leather border-2 border-accent/20 relative">
        {/* Brass corner protectors */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/40 z-10" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/40 z-10" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/40 z-10" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/40 z-10" />

        <div onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
          <div className="relative aspect-[3/4] sm:aspect-[2/3] w-full overflow-hidden bg-muted">
            {/* Page corner fold effect */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-background/80 to-transparent z-10 transform rotate-45 translate-x-4 -translate-y-4" />

            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={false}
              loading="lazy"
            />
            {/* Ribbon bookmark indicator */}
            {userBookData && userBookData.status === "currently_reading" && (
              <div className="absolute top-0 right-8 w-6 h-24 bg-primary shadow-md z-10">
                <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-primary" />
              </div>
            )}

            {userBookData && (
              <Badge
                className="absolute top-2 right-2 z-20"
                variant={
                  userBookData.status === "finished"
                    ? "default"
                    : userBookData.status === "currently_reading"
                      ? "secondary"
                      : "outline"
                }
              >
                {userBookData.status.replace(/_/g, " ")}
              </Badge>
            )}
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    }`}
                />
              </Button>
            )}
          </div>
        </div>

        <CardContent className="flex-1 px-3 py-3 sm:px-5 sm:py-4 bg-gradient-to-b from-card to-card/80">
          <div onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
            <h3 className="font-heading font-bold line-clamp-2 hover:text-primary transition-colors text-shadow-sm" style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.1), 0 0 8px rgba(184, 134, 11, 0.3)'
            }}>
              {title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-2.5 font-accent">
            {authors}
          </p>

          {rating && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}

          {showProgress && userBookData && pageCount && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {userBookData.current_page} / {pageCount} pages
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>

        <CardFooter className="p-3 sm:p-4 flex flex-col gap-2">
          {onAddToLibrary && !userBookData && (
            <Button
              onClick={onAddToLibrary}
              className="w-full transition-all duration-150 active:scale-95 min-h-[44px]"
              size="default"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Add to Library
            </Button>
          )}

          {userBookData && (
            <div className="flex gap-2 w-full">
              <Button
                onClick={onUpdateStatus}
                variant="outline"
                className="flex-1 transition-all duration-150 active:scale-95 min-h-[44px]"
                size="default"
              >
                Update Status
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="transition-all duration-150 active:scale-95 min-h-[44px] min-w-[44px]">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onUpdateProgress}>
                    Update Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onUpdateStatus}>
                    Change Status
                  </DropdownMenuItem>
                  <DropdownMenuItem>Add Review</DropdownMenuItem>
                  <DropdownMenuItem>Add to List</DropdownMenuItem>
                  <DropdownMenuItem onClick={onRemove} className="text-destructive">
                    Remove from Library
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
