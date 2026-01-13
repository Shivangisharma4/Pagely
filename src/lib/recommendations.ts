interface Book {
  id: string;
  title: string;
  authors: string[];
  categories: string[];
  average_rating?: number;
}

interface UserBook {
  book_id: string;
  status: string;
  personal_rating?: number;
  book: Book;
}

interface RecommendationScore {
  book: Book;
  score: number;
  reasons: string[];
}

export function getContentBasedRecommendations(
  userLibrary: UserBook[],
  allBooks: Book[],
  limit = 10
): RecommendationScore[] {
  // Get user preferences from their library
  const finishedBooks = userLibrary.filter((ub) => ub.status === "finished");
  const highRatedBooks = finishedBooks.filter((ub) => (ub.personal_rating || 0) >= 4);

  // Extract preferred categories and authors
  const categoryScores: Record<string, number> = {};
  const authorScores: Record<string, number> = {};

  highRatedBooks.forEach((userBook) => {
    const weight = userBook.personal_rating || 3;
    
    userBook.book.categories?.forEach((category) => {
      categoryScores[category] = (categoryScores[category] || 0) + weight;
    });
    
    userBook.book.authors?.forEach((author) => {
      authorScores[author] = (authorScores[author] || 0) + weight;
    });
  });

  // Score books not in library
  const userBookIds = new Set(userLibrary.map((ub) => ub.book_id));
  const recommendations: RecommendationScore[] = [];

  allBooks.forEach((book) => {
    if (userBookIds.has(book.id)) return;

    let score = 0;
    const reasons: string[] = [];

    // Category matching
    book.categories?.forEach((category) => {
      if (categoryScores[category]) {
        score += categoryScores[category];
        reasons.push(`Similar to ${category} books you enjoyed`);
      }
    });

    // Author matching
    book.authors?.forEach((author) => {
      if (authorScores[author]) {
        score += authorScores[author] * 2; // Weight authors higher
        reasons.push(`By ${author}, an author you like`);
      }
    });

    // Rating boost
    if (book.average_rating && book.average_rating >= 4) {
      score += book.average_rating;
      reasons.push(`Highly rated (${book.average_rating.toFixed(1)} stars)`);
    }

    if (score > 0) {
      recommendations.push({ book, score, reasons: reasons.slice(0, 2) });
    }
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getCollaborativeRecommendations(
  currentUserId: string,
  userLibrary: UserBook[],
  allUserLibraries: Record<string, UserBook[]>,
  allBooks: Book[],
  limit = 10
): RecommendationScore[] {
  // Find similar users based on shared books
  const currentUserBookIds = new Set(
    userLibrary
      .filter((ub) => (ub.personal_rating || 0) >= 4)
      .map((ub) => ub.book_id)
  );

  const userSimilarity: Record<string, number> = {};

  Object.entries(allUserLibraries).forEach(([userId, library]) => {
    if (userId === currentUserId) return;

    const otherUserBookIds = new Set(
      library
        .filter((ub) => (ub.personal_rating || 0) >= 4)
        .map((ub) => ub.book_id)
    );

    // Calculate Jaccard similarity
    const intersection = new Set(
      [...currentUserBookIds].filter((id) => otherUserBookIds.has(id))
    );
    const union = new Set([...currentUserBookIds, ...otherUserBookIds]);

    if (union.size > 0) {
      userSimilarity[userId] = intersection.size / union.size;
    }
  });

  // Get recommendations from similar users
  const bookScores: Record<string, { score: number; reasons: string[] }> = {};
  const userBookIds = new Set(userLibrary.map((ub) => ub.book_id));

  Object.entries(userSimilarity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) // Top 5 similar users
    .forEach(([userId, similarity]) => {
      allUserLibraries[userId]
        .filter((ub) => (ub.personal_rating || 0) >= 4)
        .forEach((userBook) => {
          if (userBookIds.has(userBook.book_id)) return;

          if (!bookScores[userBook.book_id]) {
            bookScores[userBook.book_id] = {
              score: 0,
              reasons: ["Recommended by users with similar taste"],
            };
          }

          bookScores[userBook.book_id].score += similarity * (userBook.personal_rating || 3);
        });
    });

  const recommendations: RecommendationScore[] = [];
  const bookMap = new Map(allBooks.map((b) => [b.id, b]));

  Object.entries(bookScores).forEach(([bookId, { score, reasons }]) => {
    const book = bookMap.get(bookId);
    if (book) {
      recommendations.push({ book, score, reasons });
    }
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getHybridRecommendations(
  currentUserId: string,
  userLibrary: UserBook[],
  allUserLibraries: Record<string, UserBook[]>,
  allBooks: Book[],
  limit = 10
): RecommendationScore[] {
  const contentBased = getContentBasedRecommendations(userLibrary, allBooks, limit * 2);
  const collaborative = getCollaborativeRecommendations(
    currentUserId,
    userLibrary,
    allUserLibraries,
    allBooks,
    limit * 2
  );

  // Merge and deduplicate
  const bookScores = new Map<string, RecommendationScore>();

  contentBased.forEach((rec) => {
    bookScores.set(rec.book.id, {
      book: rec.book,
      score: rec.score * 0.6, // Weight content-based at 60%
      reasons: rec.reasons,
    });
  });

  collaborative.forEach((rec) => {
    const existing = bookScores.get(rec.book.id);
    if (existing) {
      existing.score += rec.score * 0.4; // Weight collaborative at 40%
      existing.reasons = [...new Set([...existing.reasons, ...rec.reasons])];
    } else {
      bookScores.set(rec.book.id, {
        book: rec.book,
        score: rec.score * 0.4,
        reasons: rec.reasons,
      });
    }
  });

  return Array.from(bookScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
