"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { readingGoalInsertSchema, readingGoalUpdateSchema } from "@/lib/schemas/database.schemas";
import type { Database } from "@/types/database.types";

type GoalInsert = Database["public"]["Tables"]["reading_goals"]["Insert"];
type GoalUpdate = Database["public"]["Tables"]["reading_goals"]["Update"];

export async function createGoal(data: Omit<GoalInsert, "user_id">) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const goalData: GoalInsert = {
      user_id: user.id,
      ...data,
    };

    const validatedData = readingGoalInsertSchema.parse(goalData);

    const { data: goal, error } = await supabase
      .from("reading_goals")
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/reading-goals");
    return { data: goal, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to create goal" };
  }
}

export async function updateGoal(id: string, data: GoalUpdate) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const validatedData = readingGoalUpdateSchema.parse(data);

    const { data: goal, error } = await supabase
      .from("reading_goals")
      .update(validatedData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/reading-goals");
    return { data: goal, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to update goal" };
  }
}

export async function deleteGoal(id: string) {
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
      .from("reading_goals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/reading-goals");
    return { data: true, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to delete goal" };
  }
}

export async function getUserGoals(activeOnly = false) {
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
      .from("reading_goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    const { data: goals, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: goals, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to fetch goals" };
  }
}
