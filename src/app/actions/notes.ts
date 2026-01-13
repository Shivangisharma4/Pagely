"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createNote(bookId: string, content: string, tags?: string[], pageNumber?: number) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    // Get user_book_id
    const { data: userBook } = await supabase
      .from("user_books")
      .select("id, notes")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .single();

    if (!userBook) {
      return { data: null, error: "Book not in library" };
    }

    const note = {
      id: crypto.randomUUID(),
      content,
      tags: tags || [],
      page_number: pageNumber,
      created_at: new Date().toISOString(),
    };

    const notes = [...(userBook.notes || []), note];

    const { data, error } = await supabase
      .from("user_books")
      .update({ notes })
      .eq("id", userBook.id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/library");
    return { data: note, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to create note" };
  }
}

export async function updateNote(bookId: string, noteId: string, content: string, tags?: string[], pageNumber?: number) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data: userBook } = await supabase
      .from("user_books")
      .select("id, notes")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .single();

    if (!userBook) return { data: null, error: "Book not in library" };

    const notes = (userBook.notes || []).map((note: any) =>
      note.id === noteId
        ? { ...note, content, tags: tags || note.tags, page_number: pageNumber, updated_at: new Date().toISOString() }
        : note
    );

    const { data, error } = await supabase
      .from("user_books")
      .update({ notes })
      .eq("id", userBook.id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/library");
    return { data: notes.find((n: any) => n.id === noteId), error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to update note" };
  }
}

export async function deleteNote(bookId: string, noteId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data: userBook } = await supabase
      .from("user_books")
      .select("id, notes")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .single();

    if (!userBook) return { data: null, error: "Book not in library" };

    const notes = (userBook.notes || []).filter((note: any) => note.id !== noteId);

    const { error } = await supabase
      .from("user_books")
      .update({ notes })
      .eq("id", userBook.id);

    if (error) return { data: null, error: error.message };
    revalidatePath("/library");
    return { data: true, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to delete note" };
  }
}

export async function getNotes(bookId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data: userBook, error } = await supabase
      .from("user_books")
      .select("notes")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: userBook.notes || [], error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to fetch notes" };
  }
}

export async function searchNotes(query: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data: userBooks, error } = await supabase
      .from("user_books")
      .select("id, book_id, notes, book:books(title, authors)")
      .eq("user_id", user.id);

    if (error) return { data: null, error: error.message };

    const results: any[] = [];
    userBooks?.forEach((userBook: any) => {
      const notes = userBook.notes || [];
      notes.forEach((note: any) => {
        if (note.content.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            ...note,
            book: userBook.book,
            bookId: userBook.book_id,
          });
        }
      });
    });

    return { data: results, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to search notes" };
  }
}
