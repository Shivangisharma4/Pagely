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
import { Progress } from "@/components/ui/progress";
import { useUpdateReadingProgress } from "@/hooks/use-user-books";

const progressSchema = z.object({
  currentPage: z.number().min(0, "Page must be positive"),
});

type ProgressInput = z.infer<typeof progressSchema>;

interface UpdateProgressDialogProps {
  userBookId: string;
  currentPage: number;
  totalPages: number;
  bookTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateProgressDialog({
  userBookId,
  currentPage,
  totalPages,
  bookTitle,
  open,
  onOpenChange,
}: UpdateProgressDialogProps) {
  const updateProgress = useUpdateReadingProgress();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProgressInput>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      currentPage,
    },
  });

  const watchedPage = watch("currentPage", currentPage);
  const progress = totalPages > 0 ? (watchedPage / totalPages) * 100 : 0;

  const onSubmit = async (data: ProgressInput) => {
    await updateProgress.mutateAsync({
      id: userBookId,
      currentPage: data.currentPage,
      totalPages,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Reading Progress</DialogTitle>
          <DialogDescription>{bookTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPage">Current Page</Label>
              <Input
                id="currentPage"
                type="number"
                {...register("currentPage", { valueAsNumber: true })}
                max={totalPages}
              />
              {errors.currentPage && (
                <p className="text-sm text-destructive">{errors.currentPage.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Total pages: {totalPages}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {watchedPage} of {totalPages} pages
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateProgress.isPending}>
              {updateProgress.isPending ? "Updating..." : "Update Progress"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
