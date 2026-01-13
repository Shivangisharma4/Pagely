-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (
    privacy_settings->>'profile_public' = 'true'
    OR auth.uid() = id
  );

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Books policies (public read, authenticated write)
CREATE POLICY "Books are viewable by everyone"
  ON public.books FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert books"
  ON public.books FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update books"
  ON public.books FOR UPDATE
  TO authenticated
  USING (true);

-- User books policies
CREATE POLICY "Users can view their own books"
  ON public.user_books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public books of others"
  ON public.user_books FOR SELECT
  USING (
    NOT is_private
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = user_books.user_id
      AND privacy_settings->>'reading_activity_public' = 'true'
    )
  );

CREATE POLICY "Users can insert their own books"
  ON public.user_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON public.user_books FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
  ON public.user_books FOR DELETE
  USING (auth.uid() = user_id);

-- Reading sessions policies
CREATE POLICY "Users can view their own reading sessions"
  ON public.reading_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading sessions"
  ON public.reading_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading sessions"
  ON public.reading_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading sessions"
  ON public.reading_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Reading goals policies
CREATE POLICY "Users can view their own reading goals"
  ON public.reading_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading goals"
  ON public.reading_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading goals"
  ON public.reading_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading goals"
  ON public.reading_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Public reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (
    is_public
    OR auth.uid() = user_id
  );

CREATE POLICY "Users can insert their own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Book lists policies
CREATE POLICY "Public lists are viewable by everyone"
  ON public.book_lists FOR SELECT
  USING (
    is_public
    OR auth.uid() = user_id
  );

CREATE POLICY "Users can insert their own lists"
  ON public.book_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists"
  ON public.book_lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
  ON public.book_lists FOR DELETE
  USING (auth.uid() = user_id);

-- Book list items policies
CREATE POLICY "List items viewable based on list visibility"
  ON public.book_list_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.book_lists
      WHERE id = book_list_items.list_id
      AND (is_public OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage items in their own lists"
  ON public.book_list_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.book_lists
      WHERE id = book_list_items.list_id
      AND user_id = auth.uid()
    )
  );

-- Follows policies
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Review comments policies
CREATE POLICY "Comments viewable based on review visibility"
  ON public.review_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reviews
      WHERE id = review_comments.review_id
      AND (is_public OR user_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can comment on public reviews"
  ON public.review_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.reviews
      WHERE id = review_comments.review_id
      AND is_public = true
    )
  );

CREATE POLICY "Users can update their own comments"
  ON public.review_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.review_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Review likes policies
CREATE POLICY "Likes viewable based on review visibility"
  ON public.review_likes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reviews
      WHERE id = review_likes.review_id
      AND (is_public OR user_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can like public reviews"
  ON public.review_likes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.reviews
      WHERE id = review_likes.review_id
      AND is_public = true
    )
  );

CREATE POLICY "Users can unlike reviews"
  ON public.review_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update review likes count
CREATE OR REPLACE FUNCTION public.update_review_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.reviews
    SET likes_count = likes_count + 1
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.reviews
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to maintain review likes count
CREATE TRIGGER on_review_like_change
  AFTER INSERT OR DELETE ON public.review_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_review_likes_count();
