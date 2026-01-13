import { z } from "zod";

// Enum schemas
export const readingStatusSchema = z.enum([
  "want_to_read",
  "currently_reading",
  "finished",
  "did_not_finish",
  "on_hold",
]);

export const bookFormatSchema = z.enum([
  "hardcover",
  "paperback",
  "ebook",
  "audiobook",
  "graphic_novel",
]);

export const goalTypeSchema = z.enum([
  "books_per_year",
  "pages_per_month",
  "minutes_per_day",
  "genre_diversity",
  "author_diversity",
]);

// Nested object schemas
export const imageLinksSchema = z.object({
  thumbnail: z.string().url().optional(),
  small: z.string().url().optional(),
  medium: z.string().url().optional(),
  large: z.string().url().optional(),
  extraLarge: z.string().url().optional(),
});

export const noteSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  page: z.number().int().positive().optional(),
  chapter: z.string().optional(),
  timestamp: z.string().datetime(),
  tags: z.array(z.string()).optional(),
});

export const readingPreferencesSchema = z.object({
  preferredFormats: z.array(bookFormatSchema).optional(),
  averageReadingSpeed: z.number().positive().optional(),
  preferredReadingTimes: z.array(z.string()).optional(),
  genrePreferences: z
    .array(
      z.object({
        genre: z.string(),
        weight: z.number().min(0).max(1),
      })
    )
    .optional(),
  languagePreferences: z.array(z.string()).optional(),
});

export const privacySettingsSchema = z.object({
  profile_public: z.boolean().default(true),
  reading_activity_public: z.boolean().default(true),
  reviews_public: z.boolean().default(true),
  allow_messages: z.boolean().optional(),
  show_reading_stats: z.boolean().optional(),
});

// Profile schemas
export const profileSchema = z.object({
  id: z.string().uuid(),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers, and underscores"),
  display_name: z.string().max(100).nullable(),
  bio: z.string().max(500).nullable(),
  location: z.string().max(100).nullable(),
  profile_image_url: z.string().url().nullable(),
  favorite_genres: z.array(z.string()).nullable(),
  reading_preferences: readingPreferencesSchema,
  privacy_settings: privacySettingsSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_active_at: z.string().datetime(),
});

export const profileInsertSchema = profileSchema
  .omit({
    created_at: true,
    updated_at: true,
    last_active_at: true,
  })
  .partial({
    display_name: true,
    bio: true,
    location: true,
    profile_image_url: true,
    favorite_genres: true,
  });

export const profileUpdateSchema = profileSchema
  .omit({
    id: true,
    created_at: true,
  })
  .partial();

// Book schemas
export const bookSchema = z.object({
  id: z.string().uuid(),
  google_books_id: z.string().max(50).nullable(),
  isbn10: z.string().length(10).nullable(),
  isbn13: z.string().length(13).nullable(),
  title: z.string().min(1).max(500),
  subtitle: z.string().max(500).nullable(),
  authors: z.array(z.string()).min(1),
  publisher: z.string().max(200).nullable(),
  published_date: z.string().nullable(),
  description: z.string().nullable(),
  page_count: z.number().int().nonnegative().nullish(),
  categories: z.array(z.string()).nullable(),
  average_rating: z.number().min(0).max(5).nullable(),
  ratings_count: z.number().int().nonnegative().nullable(),
  language: z.string().max(10).default("en"),
  image_links: imageLinksSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const bookInsertSchema = bookSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .partial({
    google_books_id: true,
    isbn10: true,
    isbn13: true,
    subtitle: true,
    publisher: true,
    published_date: true,
    description: true,
    page_count: true,
    categories: true,
    average_rating: true,
    ratings_count: true,
  });

export const bookUpdateSchema = bookSchema
  .omit({
    id: true,
    created_at: true,
  })
  .partial();

// User book schemas
export const userBookSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  book_id: z.string().uuid(),
  status: readingStatusSchema,
  format: bookFormatSchema.nullable(),
  start_date: z.string().date().nullable(),
  finish_date: z.string().date().nullable(),
  current_page: z.number().int().nonnegative().default(0),
  personal_rating: z.number().int().min(1).max(5).nullable(),
  personal_review: z.string().nullable(),
  notes: z.array(noteSchema),
  tags: z.array(z.string()).nullable(),
  is_private: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const userBookInsertSchema = userBookSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .partial({
    format: true,
    start_date: true,
    finish_date: true,
    personal_rating: true,
    personal_review: true,
    tags: true,
  });

export const userBookUpdateSchema = userBookSchema
  .omit({
    id: true,
    user_id: true,
    book_id: true,
    created_at: true,
  })
  .partial();

// Reading session schemas
export const readingSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  book_id: z.string().uuid(),
  start_page: z.number().int().nonnegative(),
  end_page: z.number().int().nonnegative(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  location: z.string().max(100).nullable(),
  mood: z.string().max(50).nullable(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
});

export const readingSessionInsertSchema = readingSessionSchema
  .omit({
    id: true,
    created_at: true,
  })
  .partial({
    location: true,
    mood: true,
    notes: true,
  })
  .refine((data) => data.end_page >= data.start_page, {
    message: "End page must be greater than or equal to start page",
  })
  .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
    message: "End time must be after start time",
  });

// Reading goal schemas
export const readingGoalSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: goalTypeSchema,
  target: z.number().int().positive(),
  current: z.number().int().nonnegative().default(0),
  start_date: z.string().date(),
  end_date: z.string().date(),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const readingGoalInsertSchema = readingGoalSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .partial({
    metadata: true,
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
  });

export const readingGoalUpdateSchema = readingGoalSchema
  .omit({
    id: true,
    user_id: true,
    created_at: true,
  })
  .partial();

// Review schemas
export const reviewSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  book_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).nullable(),
  content: z.string().min(1),
  spoiler_warning: z.boolean().default(false),
  likes_count: z.number().int().nonnegative().default(0),
  is_public: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const reviewInsertSchema = reviewSchema
  .omit({
    id: true,
    likes_count: true,
    created_at: true,
    updated_at: true,
  })
  .partial({
    title: true,
  });

export const reviewUpdateSchema = reviewSchema
  .omit({
    id: true,
    user_id: true,
    book_id: true,
    likes_count: true,
    created_at: true,
  })
  .partial();

// Book list schemas
export const bookListSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().nullable(),
  cover_image_url: z.string().url().nullable(),
  is_public: z.boolean().default(true),
  is_collaborative: z.boolean().default(false),
  tags: z.array(z.string()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const bookListInsertSchema = bookListSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .partial({
    description: true,
    cover_image_url: true,
    tags: true,
  });

export const bookListUpdateSchema = bookListSchema
  .omit({
    id: true,
    user_id: true,
    created_at: true,
  })
  .partial();

// Book list item schemas
export const bookListItemSchema = z.object({
  id: z.string().uuid(),
  list_id: z.string().uuid(),
  book_id: z.string().uuid(),
  position: z.number().int().positive(),
  notes: z.string().nullable(),
  added_at: z.string().datetime(),
});

export const bookListItemInsertSchema = bookListItemSchema
  .omit({
    id: true,
    added_at: true,
  })
  .partial({
    notes: true,
  });

// Follow schemas
export const followSchema = z.object({
  id: z.string().uuid(),
  follower_id: z.string().uuid(),
  followee_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const followInsertSchema = followSchema
  .omit({
    id: true,
    created_at: true,
  })
  .refine((data) => data.follower_id !== data.followee_id, {
    message: "Cannot follow yourself",
  });

// Review comment schemas
export const reviewCommentSchema = z.object({
  id: z.string().uuid(),
  review_id: z.string().uuid(),
  user_id: z.string().uuid(),
  content: z.string().min(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const reviewCommentInsertSchema = reviewCommentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const reviewCommentUpdateSchema = reviewCommentSchema
  .omit({
    id: true,
    review_id: true,
    user_id: true,
    created_at: true,
  })
  .partial();

// Review like schemas
export const reviewLikeSchema = z.object({
  id: z.string().uuid(),
  review_id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const reviewLikeInsertSchema = reviewLikeSchema.omit({
  id: true,
  created_at: true,
});

// Export all schemas
export const schemas = {
  profile: profileSchema,
  profileInsert: profileInsertSchema,
  profileUpdate: profileUpdateSchema,
  book: bookSchema,
  bookInsert: bookInsertSchema,
  bookUpdate: bookUpdateSchema,
  userBook: userBookSchema,
  userBookInsert: userBookInsertSchema,
  userBookUpdate: userBookUpdateSchema,
  readingSession: readingSessionSchema,
  readingSessionInsert: readingSessionInsertSchema,
  readingGoal: readingGoalSchema,
  readingGoalInsert: readingGoalInsertSchema,
  readingGoalUpdate: readingGoalUpdateSchema,
  review: reviewSchema,
  reviewInsert: reviewInsertSchema,
  reviewUpdate: reviewUpdateSchema,
  bookList: bookListSchema,
  bookListInsert: bookListInsertSchema,
  bookListUpdate: bookListUpdateSchema,
  bookListItem: bookListItemSchema,
  bookListItemInsert: bookListItemInsertSchema,
  follow: followSchema,
  followInsert: followInsertSchema,
  reviewComment: reviewCommentSchema,
  reviewCommentInsert: reviewCommentInsertSchema,
  reviewCommentUpdate: reviewCommentUpdateSchema,
  reviewLike: reviewLikeSchema,
  reviewLikeInsert: reviewLikeInsertSchema,
};
