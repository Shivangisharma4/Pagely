"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateReadingSession } from "@/hooks/use-reading-sessions";
import { useUserLibrary } from "@/hooks/use-user-books";

const sessionSchema = z.object({
  bookId: z.string().min(1, "Please select a book"),
  startPage: z.number().min(0, "Start page must be positive"),
  endPage: z.number().min(0, "End page must be positive"),
  durationMinutes: z.number().min(1, "Duration must be at least 1 minute"),
}).refine((data) => data.endPage > data.startPage, {
  message: "End page must be greater than start page",
  path: ["endPage"],
});

type SessionInput = z.infer<typeof sessionSchema>;

interface LogSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedBookId?: string;
}

export function LogSessionDialog({ open, onOpenChange, preselectedBookId }: LogSessionDialogProps) {
  const createSession = useCreateReadingSession();
  const { data: library } = useUserLibrary(); // Remove status filter to show all books

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<SessionInput>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      bookId: preselectedBookId || "",
      startPage: 0,
      endPage: 0,
      durationMinutes: 30,
    },
  });

  const selectedBookId = watch("bookId");
  const selectedBook = library?.find((b) => b.book_id === selectedBookId);

  const onSubmit = async (data: SessionInput) => {
    const now = new Date();
    const startTime = new Date(now.getTime() - data.durationMinutes * 60000);

    await createSession.mutateAsync({
      book_id: data.bookId,
      start_page: data.startPage,
      end_page: data.endPage,
      start_time: startTime.toISOString(),
      end_time: now.toISOString(),
    });

    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Reading Session</DialogTitle>
          <DialogDescription>
            Record your reading progress and time spent
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bookId">Book</Label>
            <Select
              value={selectedBookId}
              onValueChange={(value) => setValue("bookId", value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {library?.map((userBook) => (
                  <SelectItem
                    key={userBook.book_id}
                    value={userBook.book_id}
                    className="cursor-pointer"
                  >
                    {userBook.book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bookId && (
              <p className="text-sm text-destructive">{errors.bookId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startPage">Start Page</Label>
              <Input
                id="startPage"
                type="number"
                className="h-11"
                {...register("startPage", { valueAsNumber: true })}
              />
              {errors.startPage && (
                <p className="text-sm text-destructive">{errors.startPage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endPage">End Page</Label>
              <Input
                id="endPage"
                type="number"
                className="h-11"
                {...register("endPage", { valueAsNumber: true })}
              />
              {errors.endPage && (
                <p className="text-sm text-destructive">{errors.endPage.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationMinutes">Duration (minutes)</Label>
            <Input
              id="durationMinutes"
              type="number"
              className="h-11"
              {...register("durationMinutes", { valueAsNumber: true })}
            />
            {errors.durationMinutes && (
              <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
            )}
          </div>

          {selectedBook && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="text-muted-foreground">
                Current progress: {selectedBook.current_page} /{" "}
                {selectedBook.book.page_count || "?"} pages
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createSession.isPending}>
              {createSession.isPending ? "Logging..." : "Log Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
