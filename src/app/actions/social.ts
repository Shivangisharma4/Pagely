"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function followUser(targetUserId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("follows")
      .insert({ follower_id: user.id, following_id: targetUserId })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/social");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to follow user" };
  }
}

export async function unfollowUser(targetUserId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);

    if (error) return { data: null, error: error.message };
    revalidatePath("/social");
    return { data: true, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to unfollow user" };
  }
}

export async function createReview(bookId: string, rating: number, reviewText?: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        book_id: bookId,
        rating,
        review_text: reviewText,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/books");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to create review" };
  }
}

export async function updateReview(reviewId: string, rating: number, reviewText?: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("reviews")
      .update({ rating, review_text: reviewText })
      .eq("id", reviewId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/books");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to update review" };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (error) return { data: null, error: error.message };
    revalidatePath("/books");
    return { data: true, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to delete review" };
  }
}

export async function likeReview(reviewId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("review_likes")
      .insert({ user_id: user.id, review_id: reviewId })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/books");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to like review" };
  }
}

export async function unlikeReview(reviewId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { error } = await supabase
      .from("review_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("review_id", reviewId);

    if (error) return { data: null, error: error.message };
    revalidatePath("/books");
    return { data: true, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to unlike review" };
  }
}

export async function createComment(reviewId: string, commentText: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("review_comments")
      .insert({
        user_id: user.id,
        review_id: reviewId,
        comment_text: commentText,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/books");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to create comment" };
  }
}
