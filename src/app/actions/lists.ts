"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createList(name: string, description?: string, isPublic = true) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("book_lists")
      .insert({
        user_id: user.id,
        name,
        description,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/lists");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to create list" };
  }
}

export async function updateList(listId: string, name: string, description?: string, isPublic?: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("book_lists")
      .update({ name, description, is_public: isPublic })
      .eq("id", listId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/lists");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to update list" };
  }
}

export async function deleteList(listId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { error } = await supabase
      .from("book_lists")
      .delete()
      .eq("id", listId)
      .eq("user_id", user.id);

    if (error) return { data: null, error: error.message };
    revalidatePath("/lists");
    return { data: true, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to delete list" };
  }
}

export async function addBookToList(listId: string, bookId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    // Get current book count for position
    const { count } = await supabase
      .from("book_lists")
      .select("book_ids", { count: "exact" })
      .eq("id", listId)
      .single();

    const { data: list, error: listError } = await supabase
      .from("book_lists")
      .select("book_ids")
      .eq("id", listId)
      .single();

    if (listError) return { data: null, error: listError.message };

    const bookIds = list.book_ids || [];
    if (bookIds.includes(bookId)) {
      return { data: null, error: "Book already in list" };
    }

    const { data, error } = await supabase
      .from("book_lists")
      .update({ book_ids: [...bookIds, bookId] })
      .eq("id", listId)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/lists");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to add book to list" };
  }
}

export async function removeBookFromList(listId: string, bookId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data: list, error: listError } = await supabase
      .from("book_lists")
      .select("book_ids")
      .eq("id", listId)
      .single();

    if (listError) return { data: null, error: listError.message };

    const bookIds = (list.book_ids || []).filter((id: string) => id !== bookId);

    const { data, error } = await supabase
      .from("book_lists")
      .update({ book_ids: bookIds })
      .eq("id", listId)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/lists");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to remove book from list" };
  }
}

export async function reorderBooksInList(listId: string, bookIds: string[]) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("book_lists")
      .update({ book_ids: bookIds })
      .eq("id", listId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/lists");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to reorder books" };
  }
}

export async function getUserLists() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { data: null, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("book_lists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to fetch lists" };
  }
}
