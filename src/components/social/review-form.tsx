"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useCreateReview } from "@/hooks/use-social";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string().max(2000).optional(),
});

type ReviewInput = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  bookId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ bookId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const createReview = useCreateReview();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewInput) => {
    await createReview.mutateAsync({
      bookId,
      rating,
      reviewText: data.reviewText,
    });
    reset();
    setRating(0);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reviewText">Review (Optional)</Label>
        <Textarea
          id="reviewText"
          {...register("reviewText")}
          placeholder="Share your thoughts about this book..."
          rows={4}
        />
        {errors.reviewText && <p className="text-sm text-destructive">{errors.reviewText.message}</p>}
      </div>

      <Button type="submit" disabled={rating === 0 || createReview.isPending}>
        {createReview.isPending ? "Posting..." : "Post Review"}
      </Button>
    </form>
  );
}
