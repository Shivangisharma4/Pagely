"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createClub(name: string, description: string, isPrivate = false) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("book_clubs")
      .insert({
        name,
        description,
        creator_id: user.id,
        is_private: isPrivate,
        member_ids: [user.id],
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/clubs");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to create club" };
  }
}

export async function joinClub(clubId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data: club } = await supabase
      .from("book_clubs")
      .select("member_ids")
      .eq("id", clubId)
      .single();

    if (!club) return { data: null, error: "Club not found" };

    const memberIds = [...(club.member_ids || []), user.id];

    const { data, error } = await supabase
      .from("book_clubs")
      .update({ member_ids: memberIds })
      .eq("id", clubId)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/clubs");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to join club" };
  }
}

export async function createChallenge(
  name: string,
  description: string,
  targetBooks: number,
  startDate: string,
  endDate: string
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("reading_challenges")
      .insert({
        name,
        description,
        creator_id: user.id,
        target_books: targetBooks,
        start_date: startDate,
        end_date: endDate,
        participant_ids: [user.id],
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/challenges");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to create challenge" };
  }
}

export async function reportContent(
  contentType: string,
  contentId: string,
  reason: string,
  details?: string
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("content_reports")
      .insert({
        reporter_id: user.id,
        content_type: contentType,
        content_id: contentId,
        reason,
        details,
        status: "pending",
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to report content" };
  }
}
