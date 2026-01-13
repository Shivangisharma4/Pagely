// Database types generated from Supabase schema

export type ReadingStatus = 
  | 'want_to_read' 
  | 'currently_reading' 
  | 'finished' 
  | 'did_not_finish' 
  | 'on_hold';

export type BookFormat = 
  | 'hardcover' 
  | 'paperback' 
  | 'ebook' 
  | 'audiobook' 
  | 'graphic_novel';

export type GoalType = 
  | 'books_per_year' 
  | 'pages_per_month' 
  | 'minutes_per_day' 
  | 'genre_diversity' 
  | 'author_diversity';

export interface ReadingPreferences {
  preferredFormats?: BookFormat[];
  averageReadingSpeed?: number; // pages per hour
  preferredReadingTimes?: string[];
  genrePreferences?: Array<{ genre: string; weight: number }>;
  languagePreferences?: string[];
}

export interface PrivacySettings {
  profile_public: boolean;
  reading_activity_public: boolean;
  reviews_public: boolean;
  allow_messages?: boolean;
  show_reading_stats?: boolean;
}

export interface ImageLinks {
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
}

export interface Note {
  id: string;
  content: string;
  page?: number;
  chapter?: string;
  timestamp: string;
  tags?: string[];
}

// Database table types
export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  location: string | null;
  profile_image_url: string | null;
  favorite_genres: string[] | null;
  reading_preferences: ReadingPreferences;
  privacy_settings: PrivacySettings;
  created_at: string;
  updated_at: string;
  last_active_at: string;
}

export interface Book {
  id: string;
  google_books_id: string | null;
  isbn10: string | null;
  isbn13: string | null;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  published_date: string | null;
  description: string | null;
  page_count: number | null;
  categories: string[] | null;
  average_rating: number | null;
  ratings_count: number | null;
  language: string;
  image_links: ImageLinks;
  created_at: string;
  updated_at: string;
}

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  status: ReadingStatus;
  format: BookFormat | null;
  start_date: string | null;
  finish_date: string | null;
  current_page: number;
  personal_rating: number | null;
  personal_review: string | null;
  notes: Note[];
  tags: string[] | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  start_page: number;
  end_page: number;
  start_time: string;
  end_time: string;
  location: string | null;
  mood: string | null;
  notes: string | null;
  created_at: string;
}

export interface ReadingGoal {
  id: string;
  user_id: string;
  type: GoalType;
  target: number;
  current: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  title: string | null;
  content: string;
  spoiler_warning: boolean;
  likes_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookList {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  is_collaborative: boolean;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface BookListItem {
  id: string;
  list_id: string;
  book_id: string;
  position: number;
  notes: string | null;
  added_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  followee_id: string;
  created_at: string;
}

export interface ReviewComment {
  id: string;
  review_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewLike {
  id: string;
  review_id: string;
  user_id: string;
  created_at: string;
}

// Extended types with relations
export interface UserBookWithBook extends UserBook {
  book: Book;
}

export interface ReviewWithUser extends Review {
  profile: Pick<Profile, 'id' | 'username' | 'display_name' | 'profile_image_url'>;
}

export interface ReviewWithDetails extends ReviewWithUser {
  book: Pick<Book, 'id' | 'title' | 'authors' | 'image_links'>;
  comments_count: number;
  user_liked: boolean;
}

export interface BookListWithItems extends BookList {
  items: Array<BookListItem & { book: Book }>;
  items_count: number;
}

// Database response types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at' | 'last_active_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      books: {
        Row: Book;
        Insert: Omit<Book, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Book, 'id' | 'created_at'>>;
      };
      user_books: {
        Row: UserBook;
        Insert: Omit<UserBook, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserBook, 'id' | 'user_id' | 'book_id' | 'created_at'>>;
      };
      reading_sessions: {
        Row: ReadingSession;
        Insert: Omit<ReadingSession, 'id' | 'created_at'>;
        Update: Partial<Omit<ReadingSession, 'id' | 'user_id' | 'book_id' | 'created_at'>>;
      };
      reading_goals: {
        Row: ReadingGoal;
        Insert: Omit<ReadingGoal, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ReadingGoal, 'id' | 'user_id' | 'created_at'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'likes_count' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Review, 'id' | 'user_id' | 'book_id' | 'likes_count' | 'created_at'>>;
      };
      book_lists: {
        Row: BookList;
        Insert: Omit<BookList, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BookList, 'id' | 'user_id' | 'created_at'>>;
      };
      book_list_items: {
        Row: BookListItem;
        Insert: Omit<BookListItem, 'id' | 'added_at'>;
        Update: Partial<Omit<BookListItem, 'id' | 'list_id' | 'book_id' | 'added_at'>>;
      };
      follows: {
        Row: Follow;
        Insert: Omit<Follow, 'id' | 'created_at'>;
        Update: never;
      };
      review_comments: {
        Row: ReviewComment;
        Insert: Omit<ReviewComment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ReviewComment, 'id' | 'review_id' | 'user_id' | 'created_at'>>;
      };
      review_likes: {
        Row: ReviewLike;
        Insert: Omit<ReviewLike, 'id' | 'created_at'>;
        Update: never;
      };
    };
    Enums: {
      reading_status: ReadingStatus;
      book_format: BookFormat;
      goal_type: GoalType;
    };
  };
};
