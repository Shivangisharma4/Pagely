"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/).optional(),
  display_name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  profile_image_url: z.string().url().optional().nullable(),
  is_profile_public: z.boolean().optional(),
  show_reading_stats: z.boolean().optional(),
  show_currently_reading: z.boolean().optional(),
});

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const validatedData = updateProfileSchema.parse(data);

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(validatedData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/profile");
    return { data: profile, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to update profile" };
  }
}

export async function getProfile(userId?: string) {
  try {
    const supabase = await createClient();

    let targetUserId = userId;

    if (!targetUserId) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { data: null, error: "Unauthorized" };
      }

      targetUserId = user.id;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", targetUserId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: profile, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to fetch profile" };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: true, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to update password" };
  }
}
