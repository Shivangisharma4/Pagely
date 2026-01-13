"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { readingSessionInsertSchema } from "@/lib/schemas/database.schemas";
import type { Database } from "@/types/database.types";

type ReadingSessionInsert = Database["public"]["Tables"]["reading_sessions"]["Insert"];

export async function createReadingSession(data: Omit<ReadingSessionInsert, "user_id">) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const sessionData: ReadingSessionInsert = {
      user_id: user.id,
      ...data,
    };

    const validatedData = readingSessionInsertSchema.parse(sessionData);

    const { data: session, error } = await supabase
      .from("reading_sessions")
      .insert(validatedData)
      .select("*, book:books(title, authors)")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Update user book progress
    if (data.end_page > data.start_page) {
      await supabase
        .from("user_books")
        .update({ current_page: data.end_page })
        .eq("user_id", user.id)
        .eq("book_id", data.book_id);
    }

    revalidatePath("/reading-sessions");
    return { data: session, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to create reading session" };
  }
}

export async function getReadingSessions(bookId?: string, limit = 50) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    let query = supabase
      .from("reading_sessions")
      .select("*, book:books(title, authors)")
      .eq("user_id", user.id)
      .order("start_time", { ascending: false })
      .limit(limit);

    if (bookId) {
      query = query.eq("book_id", bookId);
    }

    const { data: sessions, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: sessions, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to fetch reading sessions" };
  }
}

export async function getReadingStats(timeRange: "week" | "month" | "year" = "month") {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const { data: sessions, error } = await supabase
      .from("reading_sessions")
      .select("*")
      .eq("user_id", user.id)
      .gte("start_time", startDate.toISOString());

    if (error) {
      return { data: null, error: error.message };
    }

    // Calculate stats
    const totalPages = sessions.reduce(
      (sum, session) => sum + (session.end_page - session.start_page),
      0
    );

    const totalMinutes = sessions.reduce((sum, session) => {
      const start = new Date(session.start_time).getTime();
      const end = new Date(session.end_time).getTime();
      return sum + (end - start) / 1000 / 60;
    }, 0);

    const stats = {
      totalSessions: sessions.length,
      totalPages,
      totalMinutes: Math.round(totalMinutes),
      averagePagesPerSession: sessions.length > 0 ? Math.round(totalPages / sessions.length) : 0,
      averageMinutesPerSession: sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
    };

    return { data: stats, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to fetch reading stats" };
  }
}
