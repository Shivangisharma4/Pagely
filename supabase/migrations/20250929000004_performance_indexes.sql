-- Performance indexes for common queries

-- User books indexes
CREATE INDEX IF NOT EXISTS idx_user_books_user_status ON public.user_books(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_books_book ON public.user_books(book_id);
CREATE INDEX IF NOT EXISTS idx_user_books_updated ON public.user_books(updated_at DESC);

-- Books indexes
CREATE INDEX IF NOT EXISTS idx_books_google_id ON public.books(google_books_id);
CREATE INDEX IF NOT EXISTS idx_books_isbn13 ON public.books(isbn13) WHERE isbn13 IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_isbn10 ON public.books(isbn10) WHERE isbn10 IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books USING gin(to_tsvector('english', title));

-- Reading sessions indexes
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user ON public.reading_sessions(user_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book ON public.reading_sessions(book_id);

-- Reading goals indexes
CREATE INDEX IF NOT EXISTS idx_reading_goals_user_active ON public.reading_goals(user_id, is_active);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_book ON public.reviews(book_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);

-- Book lists indexes
CREATE INDEX IF NOT EXISTS idx_book_lists_user ON public.book_lists(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_lists_public ON public.book_lists(is_public) WHERE is_public = true;

-- Follows indexes
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followee ON public.follows(followee_id);

-- Review likes indexes
CREATE INDEX IF NOT EXISTS idx_review_likes_review ON public.review_likes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_likes_user ON public.review_likes(user_id);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;

-- Analyze tables for query planner
ANALYZE public.user_books;
ANALYZE public.books;
ANALYZE public.reading_sessions;
ANALYZE public.reading_goals;
ANALYZE public.reviews;
ANALYZE public.book_lists;
ANALYZE public.follows;
ANALYZE public.profiles;
