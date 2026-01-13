-- Function to find duplicate books
CREATE OR REPLACE FUNCTION find_duplicate_books(
  p_title TEXT,
  p_authors TEXT[],
  p_isbn13 TEXT DEFAULT NULL,
  p_isbn10 TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  authors TEXT[],
  isbn13 VARCHAR,
  isbn10 VARCHAR,
  similarity_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    b.authors,
    b.isbn13,
    b.isbn10,
    CASE
      -- Exact ISBN match
      WHEN (p_isbn13 IS NOT NULL AND b.isbn13 = p_isbn13) OR 
           (p_isbn10 IS NOT NULL AND b.isbn10 = p_isbn10) THEN 1.0
      -- Title and author match
      WHEN LOWER(b.title) = LOWER(p_title) AND b.authors = p_authors THEN 0.9
      -- Similar title and matching authors
      WHEN similarity(LOWER(b.title), LOWER(p_title)) > 0.7 AND b.authors = p_authors THEN 0.8
      -- Similar title only
      WHEN similarity(LOWER(b.title), LOWER(p_title)) > 0.8 THEN 0.6
      ELSE 0.0
    END AS similarity_score
  FROM public.books b
  WHERE 
    (p_isbn13 IS NOT NULL AND b.isbn13 = p_isbn13) OR
    (p_isbn10 IS NOT NULL AND b.isbn10 = p_isbn10) OR
    (similarity(LOWER(b.title), LOWER(p_title)) > 0.6)
  ORDER BY similarity_score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to bulk add books to user library
CREATE OR REPLACE FUNCTION bulk_add_books_to_library(
  p_user_id UUID,
  p_books JSONB
)
RETURNS TABLE (
  success_count INTEGER,
  error_count INTEGER,
  errors JSONB
) AS $$
DECLARE
  v_book JSONB;
  v_success_count INTEGER := 0;
  v_error_count INTEGER := 0;
  v_errors JSONB := '[]'::JSONB;
  v_book_id UUID;
BEGIN
  FOR v_book IN SELECT * FROM jsonb_array_elements(p_books)
  LOOP
    BEGIN
      v_book_id := (v_book->>'book_id')::UUID;
      
      -- Check if book already exists in user's library
      IF EXISTS (
        SELECT 1 FROM public.user_books 
        WHERE user_id = p_user_id AND book_id = v_book_id
      ) THEN
        v_error_count := v_error_count + 1;
        v_errors := v_errors || jsonb_build_object(
          'book_id', v_book_id,
          'error', 'Book already in library'
        );
        CONTINUE;
      END IF;
      
      -- Insert book into user's library
      INSERT INTO public.user_books (
        user_id,
        book_id,
        status,
        format,
        current_page
      ) VALUES (
        p_user_id,
        v_book_id,
        COALESCE((v_book->>'status')::reading_status, 'want_to_read'),
        (v_book->>'format')::book_format,
        COALESCE((v_book->>'current_page')::INTEGER, 0)
      );
      
      v_success_count := v_success_count + 1;
    EXCEPTION WHEN OTHERS THEN
      v_error_count := v_error_count + 1;
      v_errors := v_errors || jsonb_build_object(
        'book_id', v_book_id,
        'error', SQLERRM
      );
    END;
  END LOOP;
  
  RETURN QUERY SELECT v_success_count, v_error_count, v_errors;
END;
$$ LANGUAGE plpgsql;

-- Function to get reading statistics
CREATE OR REPLACE FUNCTION get_user_reading_statistics(
  p_user_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  total_books_read INTEGER,
  total_pages_read INTEGER,
  total_reading_time_minutes INTEGER,
  books_by_status JSONB,
  books_by_format JSONB,
  favorite_genres JSONB,
  reading_streak_days INTEGER
) AS $$
DECLARE
  v_start_date DATE;
  v_end_date DATE;
BEGIN
  v_start_date := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '1 year');
  v_end_date := COALESCE(p_end_date, CURRENT_DATE);
  
  RETURN QUERY
  WITH book_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE ub.status = 'finished') AS finished_count,
      COALESCE(SUM(b.page_count) FILTER (WHERE ub.status = 'finished'), 0) AS pages_count
    FROM public.user_books ub
    JOIN public.books b ON b.id = ub.book_id
    WHERE ub.user_id = p_user_id
      AND ub.finish_date BETWEEN v_start_date AND v_end_date
  ),
  reading_time AS (
    SELECT
      COALESCE(
        SUM(EXTRACT(EPOCH FROM (rs.end_time - rs.start_time)) / 60)::INTEGER,
        0
      ) AS minutes
    FROM public.reading_sessions rs
    WHERE rs.user_id = p_user_id
      AND rs.start_time::DATE BETWEEN v_start_date AND v_end_date
  ),
  status_breakdown AS (
    SELECT jsonb_object_agg(
      ub.status,
      COUNT(*)
    ) AS by_status
    FROM public.user_books ub
    WHERE ub.user_id = p_user_id
    GROUP BY ub.user_id
  ),
  format_breakdown AS (
    SELECT jsonb_object_agg(
      ub.format,
      COUNT(*)
    ) AS by_format
    FROM public.user_books ub
    WHERE ub.user_id = p_user_id AND ub.format IS NOT NULL
    GROUP BY ub.user_id
  ),
  genre_stats AS (
    SELECT jsonb_object_agg(
      genre,
      genre_count
    ) AS genres
    FROM (
      SELECT 
        unnest(b.categories) AS genre,
        COUNT(*) AS genre_count
      FROM public.user_books ub
      JOIN public.books b ON b.id = ub.book_id
      WHERE ub.user_id = p_user_id
      GROUP BY genre
      ORDER BY genre_count DESC
      LIMIT 10
    ) g
  ),
  streak AS (
    SELECT COUNT(*) AS days
    FROM (
      SELECT DISTINCT rs.start_time::DATE AS read_date
      FROM public.reading_sessions rs
      WHERE rs.user_id = p_user_id
        AND rs.start_time::DATE >= CURRENT_DATE - INTERVAL '365 days'
      ORDER BY read_date DESC
    ) dates
    WHERE read_date >= CURRENT_DATE - (
      SELECT COUNT(*) 
      FROM generate_series(
        CURRENT_DATE - INTERVAL '365 days',
        CURRENT_DATE,
        '1 day'::INTERVAL
      ) d
      WHERE d::DATE IN (
        SELECT DISTINCT rs.start_time::DATE
        FROM public.reading_sessions rs
        WHERE rs.user_id = p_user_id
          AND rs.start_time::DATE >= CURRENT_DATE - INTERVAL '365 days'
      )
    )
  )
  SELECT
    bs.finished_count::INTEGER,
    bs.pages_count::INTEGER,
    rt.minutes,
    COALESCE(sb.by_status, '{}'::JSONB),
    COALESCE(fb.by_format, '{}'::JSONB),
    COALESCE(gs.genres, '{}'::JSONB),
    COALESCE(s.days, 0)::INTEGER
  FROM book_stats bs
  CROSS JOIN reading_time rt
  LEFT JOIN status_breakdown sb ON true
  LEFT JOIN format_breakdown fb ON true
  LEFT JOIN genre_stats gs ON true
  LEFT JOIN streak s ON true;
END;
$$ LANGUAGE plpgsql;

-- Function to update reading goal progress
CREATE OR REPLACE FUNCTION update_reading_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update books per year goals
  UPDATE public.reading_goals
  SET current = (
    SELECT COUNT(*)
    FROM public.user_books
    WHERE user_id = NEW.user_id
      AND status = 'finished'
      AND finish_date >= reading_goals.start_date::DATE
      AND finish_date <= reading_goals.end_date::DATE
  )
  WHERE user_id = NEW.user_id
    AND type = 'books_per_year'
    AND is_active = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update reading goals when book status changes
CREATE TRIGGER update_reading_goals_on_book_finish
  AFTER INSERT OR UPDATE OF status ON public.user_books
  FOR EACH ROW
  WHEN (NEW.status = 'finished')
  EXECUTE FUNCTION update_reading_goal_progress();
