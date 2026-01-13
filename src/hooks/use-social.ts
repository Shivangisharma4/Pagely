import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  followUser,
  unfollowUser,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
  createComment,
} from "@/app/actions/social";
import { useToast } from "./use-toast";

export function useFollowUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      toast({ title: "Success", description: "User followed" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      toast({ title: "Success", description: "User unfollowed" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ bookId, rating, reviewText }: { bookId: string; rating: number; reviewText?: string }) =>
      createReview(bookId, rating, reviewText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Success", description: "Review posted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ reviewId, rating, reviewText }: { reviewId: string; rating: number; reviewText?: string }) =>
      updateReview(reviewId, rating, reviewText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Success", description: "Review updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Success", description: "Review deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useLikeReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useUnlikeReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlikeReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ reviewId, commentText }: { reviewId: string; commentText: string }) =>
      createComment(reviewId, commentText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Success", description: "Comment posted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
