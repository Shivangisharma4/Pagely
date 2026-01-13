-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE reading_status AS ENUM ('want_to_read', 'currently_reading', 'finished', 'did_not_finish', 'on_hold');
CREATE TYPE book_format AS ENUM ('hardcover', 'paperback', 'ebook', 'audiobook', 'graphic_novel');
CREATE TYPE goal_type AS ENUM ('books_per_year', 'pages_per_month', 'minutes_per_day', 'genre_diversity', 'author_diversity');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  location VARCHAR(100),
  profile_image_url TEXT,
  favorite_genres TEXT[],
  reading_preferences JSONB DEFAULT '{}'::jsonb,
  privacy_settings JSONB DEFAULT '{"profile_public": true, "reading_activity_public": true, "reviews_public": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Books table
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_books_id VARCHAR(50) UNIQUE,
  isbn10 VARCHAR(10),
  isbn13 VARCHAR(13),
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  authors TEXT[] NOT NULL,
  publisher VARCHAR(200),
  published_date DATE,
  description TEXT,
  page_count INTEGER,
  categories TEXT[],
  average_rating DECIMAL(3,2),
  ratings_count INTEGER,
  language VARCHAR(10) DEFAULT 'en',
  image_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT page_count_positive CHECK (page_count > 0),
  CONSTRAINT rating_range CHECK (average_rating >= 0 AND average_rating <= 5)
);

-- User books (junction table with reading data)
CREATE TABLE public.user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  status reading_status NOT NULL DEFAULT 'want_to_read',
  format book_format,
  start_date DATE,
  finish_date DATE,
  current_page INTEGER DEFAULT 0,
  personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 5),
  personal_review TEXT,
  notes JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, book_id, created_at),
  CONSTRAINT current_page_valid CHECK (current_page >= 0),
  CONSTRAINT dates_logical CHECK (finish_date IS NULL OR start_date IS NULL OR finish_date >= start_date)
);

-- Reading sessions
CREATE TABLE public.reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  start_page INTEGER NOT NULL,
  end_page INTEGER NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(100),
  mood VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT pages_logical CHECK (end_page >= start_page),
  CONSTRAINT times_logical CHECK (end_time > start_time)
);

-- Reading goals
CREATE TABLE public.reading_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type goal_type NOT NULL,
  target INTEGER NOT NULL,
  current INTEGER DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT target_positive CHECK (target > 0),
  CONSTRAINT current_non_negative CHECK (current >= 0),
  CONSTRAINT dates_valid CHECK (end_date > start_date)
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  spoiler_warning BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, book_id)
);

-- Book lists
CREATE TABLE public.book_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  is_collaborative BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book list items
CREATE TABLE public.book_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.book_lists(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  notes TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(list_id, book_id),
  CONSTRAINT position_positive CHECK (position > 0)
);

-- Social follows
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  followee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(follower_id, followee_id),
  CONSTRAINT no_self_follow CHECK (follower_id != followee_id)
);

-- Review comments
CREATE TABLE public.review_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Review likes
CREATE TABLE public.review_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(review_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

CREATE INDEX idx_books_google_id ON public.books(google_books_id);
CREATE INDEX idx_books_isbn13 ON public.books(isbn13);
CREATE INDEX idx_books_isbn10 ON public.books(isbn10);
CREATE INDEX idx_books_title_trgm ON public.books USING gin(title gin_trgm_ops);
CREATE INDEX idx_books_authors_gin ON public.books USING gin(authors);
CREATE INDEX idx_books_categories_gin ON public.books USING gin(categories);

CREATE INDEX idx_user_books_user_status ON public.user_books(user_id, status);
CREATE INDEX idx_user_books_book ON public.user_books(book_id);
CREATE INDEX idx_user_books_created ON public.user_books(created_at DESC);

CREATE INDEX idx_reading_sessions_user ON public.reading_sessions(user_id);
CREATE INDEX idx_reading_sessions_book ON public.reading_sessions(book_id);
CREATE INDEX idx_reading_sessions_created ON public.reading_sessions(created_at DESC);

CREATE INDEX idx_reading_goals_user_active ON public.reading_goals(user_id, is_active);

CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_reviews_book ON public.reviews(book_id);
CREATE INDEX idx_reviews_created ON public.reviews(created_at DESC);
CREATE INDEX idx_reviews_public ON public.reviews(is_public, created_at DESC);

CREATE INDEX idx_book_lists_user ON public.book_lists(user_id);
CREATE INDEX idx_book_lists_public ON public.book_lists(is_public, created_at DESC);

CREATE INDEX idx_book_list_items_list ON public.book_list_items(list_id, position);

CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_followee ON public.follows(followee_id);

CREATE INDEX idx_review_comments_review ON public.review_comments(review_id);
CREATE INDEX idx_review_likes_review ON public.review_likes(review_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_books_updated_at BEFORE UPDATE ON public.user_books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_goals_updated_at BEFORE UPDATE ON public.reading_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_lists_updated_at BEFORE UPDATE ON public.book_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_comments_updated_at BEFORE UPDATE ON public.review_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
