"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bookInsertSchema, bookUpdateSchema } from "@/lib/schemas/database.schemas";
import type { Database } from "@/types/database.types";

type BookInsert = Database["public"]["Tables"]["books"]["Insert"];
type BookUpdate = Database["public"]["Tables"]["books"]["Update"];

export async function createBook(data: BookInsert) {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = bookInsertSchema.parse(data);

    // Check for existing book by Google Books ID or ISBN
    if (validatedData.google_books_id) {
      const { data: existing } = await supabase
        .from("books")
        .select("id")
        .eq("google_books_id", validatedData.google_books_id)
        .single();

      if (existing) {
        return { data: existing, error: null };
      }
    }

    // Insert book
    const { data: book, error } = await supabase
      .from("books")
      .insert(validatedData as any)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/books");
    return { data: book, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to create book" };
  }
}

export async function updateBook(id: string, data: BookUpdate) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const validatedData = bookUpdateSchema.parse(data);

    const { data: book, error } = await supabase
      .from("books")
      .update(validatedData as any)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/books");
    return { data: book, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to update book" };
  }
}

export async function getBookById(id: string) {
  try {
    const supabase = await createClient();

    const { data: book, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: book, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to fetch book" };
  }
}

export async function searchBooks(query: string, limit = 20) {
  try {
    const supabase = await createClient();

    const { data: books, error } = await supabase
      .from("books")
      .select("*")
      .textSearch("title", query)
      .limit(limit);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: books, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to search books" };
  }
}
