interface UserBook {
  status: string;
  personal_rating?: number;
  finish_date?: string;
  book: {
    categories?: string[];
    page_count?: number;
    authors?: string[];
  };
}

interface ReadingSession {
  start_time: string;
  end_time: string;
  start_page: number;
  end_page: number;
}

export interface YearInReview {
  year: number;
  totalBooksRead: number;
  totalPages: number;
  totalReadingTime: number;
  averageRating: number;
  topGenres: Array<{ genre: string; count: number }>;
  topAuthors: Array<{ author: string; count: number }>;
  longestBook: { title: string; pages: number } | null;
  monthlyBreakdown: Array<{ month: string; books: number }>;
  readingStreak: number;
}

export function calculateYearInReview(
  year: number,
  userBooks: UserBook[],
  sessions: ReadingSession[]
): YearInReview {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // Filter books finished in the year
  const booksFinished = userBooks.filter((ub) => {
    if (!ub.finish_date || ub.status !== "finished") return false;
    const finishDate = new Date(ub.finish_date);
    return finishDate >= yearStart && finishDate <= yearEnd;
  });

  // Total pages
  const totalPages = booksFinished.reduce(
    (sum, ub) => sum + (ub.book.page_count || 0),
    0
  );

  // Average rating
  const ratedBooks = booksFinished.filter((ub) => ub.personal_rating);
  const averageRating =
    ratedBooks.length > 0
      ? ratedBooks.reduce((sum, ub) => sum + (ub.personal_rating || 0), 0) / ratedBooks.length
      : 0;

  // Top genres
  const genreCounts: Record<string, number> = {};
  booksFinished.forEach((ub) => {
    ub.book.categories?.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });
  const topGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top authors
  const authorCounts: Record<string, number> = {};
  booksFinished.forEach((ub) => {
    ub.book.authors?.forEach((author) => {
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });
  });
  const topAuthors = Object.entries(authorCounts)
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Longest book
  const longestBook = booksFinished.reduce<{ title: string; pages: number } | null>(
    (longest, ub) => {
      const pages = ub.book.page_count || 0;
      if (!longest || pages > longest.pages) {
        return { title: (ub.book as any).title || "Unknown", pages };
      }
      return longest;
    },
    null
  );

  // Monthly breakdown
  const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(year, i).toLocaleString("default", { month: "short" }),
    books: 0,
  }));
  booksFinished.forEach((ub) => {
    if (ub.finish_date) {
      const month = new Date(ub.finish_date).getMonth();
      monthlyBreakdown[month].books++;
    }
  });

  // Total reading time from sessions
  const yearSessions = sessions.filter((s) => {
    const sessionDate = new Date(s.start_time);
    return sessionDate >= yearStart && sessionDate <= yearEnd;
  });
  const totalReadingTime = yearSessions.reduce((sum, s) => {
    const duration = new Date(s.end_time).getTime() - new Date(s.start_time).getTime();
    return sum + duration / 1000 / 60; // Convert to minutes
  }, 0);

  // Reading streak (simplified)
  const readingStreak = calculateReadingStreak(yearSessions);

  return {
    year,
    totalBooksRead: booksFinished.length,
    totalPages,
    totalReadingTime: Math.round(totalReadingTime),
    averageRating: Math.round(averageRating * 10) / 10,
    topGenres,
    topAuthors,
    longestBook,
    monthlyBreakdown,
    readingStreak,
  };
}

function calculateReadingStreak(sessions: ReadingSession[]): number {
  if (sessions.length === 0) return 0;

  const dates = new Set(
    sessions.map((s) => new Date(s.start_time).toDateString())
  );
  const sortedDates = Array.from(dates)
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = Math.floor(
      (sortedDates[i].getTime() - sortedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateGenreDistribution(userBooks: UserBook[]) {
  const genreCounts: Record<string, number> = {};
  
  userBooks.forEach((ub) => {
    ub.book.categories?.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(genreCounts)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function calculateReadingPatterns(sessions: ReadingSession[]) {
  const hourCounts: Record<number, number> = {};
  const dayOfWeekCounts: Record<number, number> = {};

  sessions.forEach((session) => {
    const date = new Date(session.start_time);
    const hour = date.getHours();
    const dayOfWeek = date.getDay();

    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return {
    byHour: Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => a.hour - b.hour),
    byDayOfWeek: Object.entries(dayOfWeekCounts)
      .map(([day, count]) => ({ day: days[parseInt(day)], count }))
      .sort((a, b) => parseInt(Object.keys(dayOfWeekCounts).find(k => days[parseInt(k)] === a.day)!) - parseInt(Object.keys(dayOfWeekCounts).find(k => days[parseInt(k)] === b.day)!)),
  };
}
