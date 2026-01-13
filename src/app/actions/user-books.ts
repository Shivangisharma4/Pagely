"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { userBookInsertSchema, userBookUpdateSchema } from "@/lib/schemas/database.schemas";
import type { Database } from "@/types/database.types";
import type { ReadingStatus } from "@/types/database.types";

type UserBookInsert = Database["public"]["Tables"]["user_books"]["Insert"];
type UserBookUpdate = Database["public"]["Tables"]["user_books"]["Update"];

export async function addBookToLibrary(bookId: string, data: Omit<UserBookInsert, "user_id" | "book_id">) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    // Check if book already exists in user's library
    const { data: existing } = await supabase
      .from("user_books")
      .select("id")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .single();

    if (existing) {
      return { data: null, error: "Book already in library" };
    }

    const userBookData: UserBookInsert = {
      user_id: user.id,
      book_id: bookId,
      ...data,
    };

    const validatedData = userBookInsertSchema.parse(userBookData);

    const { data: userBook, error } = await supabase
      .from("user_books")
      .insert(validatedData)
      .select("*, book:books(*)")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/library");
    return { data: userBook, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to add book to library" };
  }
}

export async function updateUserBook(id: string, data: UserBookUpdate) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const validatedData = userBookUpdateSchema.parse(data);

    const { data: userBook, error } = await supabase
      .from("user_books")
      .update(validatedData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*, book:books(*)")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/library");
    return { data: userBook, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to update book" };
  }
}

export async function removeBookFromLibrary(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("user_books")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/library");
    return { data: true, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to remove book" };
  }
}

export async function getUserLibrary(status?: ReadingStatus) {
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
      .from("user_books")
      .select("*, book:books(*)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: books, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: books, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to fetch library" };
  }
}

export async function updateReadingProgress(
  id: string,
  currentPage: number,
  totalPages?: number
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    // Get current book data
    const { data: userBook } = await supabase
      .from("user_books")
      .select("*, book:books(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!userBook) {
      return { data: null, error: "Book not found" };
    }

    const updates: UserBookUpdate = {
      current_page: currentPage,
    };

    // Auto-mark as finished if completed
    const bookPageCount = totalPages || (userBook.book as any)?.page_count;
    if (bookPageCount && currentPage >= bookPageCount) {
      updates.status = "finished";
      updates.finish_date = new Date().toISOString().split("T")[0];
    }

    const { data: updated, error } = await supabase
      .from("user_books")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*, book:books(*)")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/library");
    return { data: updated, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to update progress" };
  }
}
