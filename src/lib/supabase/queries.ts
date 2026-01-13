import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

// Profile queries
export const profileQueries = {
  getById: async (client: Client, userId: string) => {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  getByUsername: async (client: Client, username: string) => {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (error) throw error;
    return data;
  },

  update: async (
    client: Client,
    userId: string,
    updates: Database["public"]["Tables"]["profiles"]["Update"]
  ) => {
    const { data, error } = await client
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Book queries
export const bookQueries = {
  getById: async (client: Client, bookId: string) => {
    const { data, error } = await client
      .from("books")
      .select("*")
      .eq("id", bookId)
      .single();

    if (error) throw error;
    return data;
  },

  getByGoogleBooksId: async (client: Client, googleBooksId: string) => {
    const { data, error } = await client
      .from("books")
      .select("*")
      .eq("google_books_id", googleBooksId)
      .single();

    if (error) throw error;
    return data;
  },

  search: async (client: Client, query: string, limit = 20) => {
    const { data, error } = await client
      .from("books")
      .select("*")
      .textSearch("title", query)
      .limit(limit);

    if (error) throw error;
    return data;
  },

  create: async (
    client: Client,
    book: Database["public"]["Tables"]["books"]["Insert"]
  ) => {
    const { data, error } = await client
      .from("books")
      .insert(book)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// User book queries
export const userBookQueries = {
  getByUserId: async (client: Client, userId: string) => {
    const { data, error } = await client
      .from("user_books")
      .select("*, book:books(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  getByStatus: async (
    client: Client,
    userId: string,
    status: Database["public"]["Enums"]["reading_status"]
  ) => {
    const { data, error } = await client
      .from("user_books")
      .select("*, book:books(*)")
      .eq("user_id", userId)
      .eq("status", status)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (
    client: Client,
    userBook: Database["public"]["Tables"]["user_books"]["Insert"]
  ) => {
    const { data, error } = await client
      .from("user_books")
      .insert(userBook)
      .select("*, book:books(*)")
      .single();

    if (error) throw error;
    return data;
  },

  update: async (
    client: Client,
    id: string,
    updates: Database["public"]["Tables"]["user_books"]["Update"]
  ) => {
    const { data, error } = await client
      .from("user_books")
      .update(updates)
      .eq("id", id)
      .select("*, book:books(*)")
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (client: Client, id: string) => {
    const { error } = await client.from("user_books").delete().eq("id", id);

    if (error) throw error;
  },
};

// Reading session queries
export const readingSessionQueries = {
  getByUserId: async (client: Client, userId: string, limit = 50) => {
    const { data, error } = await client
      .from("reading_sessions")
      .select("*, book:books(title, authors)")
      .eq("user_id", userId)
      .order("start_time", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  create: async (
    client: Client,
    session: Database["public"]["Tables"]["reading_sessions"]["Insert"]
  ) => {
    const { data, error } = await client
      .from("reading_sessions")
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Reading goal queries
export const readingGoalQueries = {
  getActiveByUserId: async (client: Client, userId: string) => {
    const { data, error } = await client
      .from("reading_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (
    client: Client,
    goal: Database["public"]["Tables"]["reading_goals"]["Insert"]
  ) => {
    const { data, error } = await client
      .from("reading_goals")
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (
    client: Client,
    id: string,
    updates: Database["public"]["Tables"]["reading_goals"]["Update"]
  ) => {
    const { data, error } = await client
      .from("reading_goals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Review queries
export const reviewQueries = {
  getByBookId: async (client: Client, bookId: string) => {
    const { data, error } = await client
      .from("reviews")
      .select(
        `
        *,
        profile:profiles(id, username, display_name, profile_image_url)
      `
      )
      .eq("book_id", bookId)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  getByUserId: async (client: Client, userId: string) => {
    const { data, error } = await client
      .from("reviews")
      .select("*, book:books(id, title, authors, image_links)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (
    client: Client,
    review: Database["public"]["Tables"]["reviews"]["Insert"]
  ) => {
    const { data, error } = await client
      .from("reviews")
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (
    client: Client,
    id: string,
    updates: Database["public"]["Tables"]["reviews"]["Update"]
  ) => {
    const { data, error } = await client
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (client: Client, id: string) => {
    const { error } = await client.from("reviews").delete().eq("id", id);

    if (error) throw error;
  },
};

// Book list queries
export const bookListQueries = {
  getByUserId: async (client: Client, userId: string) => {
    const { data, error } = await client
      .from("book_lists")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  getPublic: async (client: Client, limit = 20) => {
    const { data, error } = await client
      .from("book_lists")
      .select("*, profile:profiles(username, display_name)")
      .eq("is_public", true)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  getWithItems: async (client: Client, listId: string) => {
    const { data, error } = await client
      .from("book_lists")
      .select(
        `
        *,
        items:book_list_items(
          *,
          book:books(*)
        )
      `
      )
      .eq("id", listId)
      .single();

    if (error) throw error;
    return data;
  },

  create: async (
    client: Client,
    list: Database["public"]["Tables"]["book_lists"]["Insert"]
  ) => {
    const { data, error } = await client
      .from("book_lists")
      .insert(list)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (
    client: Client,
    id: string,
    updates: Database["public"]["Tables"]["book_lists"]["Update"]
  ) => {
    const { data, error } = await client
      .from("book_lists")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (client: Client, id: string) => {
    const { error } = await client.from("book_lists").delete().eq("id", id);

    if (error) throw error;
  },
};

// Follow queries
export const followQueries = {
  getFollowers: async (client: Client, userId: string) => {
    const { data, error } = await client
      .from("follows")
      .select("follower:profiles!follower_id(*)")
      .eq("followee_id", userId);

    if (error) throw error;
    return data;
  },

  getFollowing: async (client: Client, userId: string) => {
    const { data, error } = await client
      .from("follows")
      .select("followee:profiles!followee_id(*)")
      .eq("follower_id", userId);

    if (error) throw error;
    return data;
  },

  follow: async (client: Client, followerId: string, followeeId: string) => {
    const { data, error } = await client
      .from("follows")
      .insert({ follower_id: followerId, followee_id: followeeId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  unfollow: async (client: Client, followerId: string, followeeId: string) => {
    const { error } = await client
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("followee_id", followeeId);

    if (error) throw error;
  },
};
