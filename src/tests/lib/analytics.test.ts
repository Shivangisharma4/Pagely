import { describe, it, expect } from "vitest";
import { calculateYearInReview, calculateGenreDistribution } from "@/lib/analytics";

describe("Analytics", () => {
  describe("calculateYearInReview", () => {
    const mockBooks = [
      {
        status: "finished",
        finish_date: "2024-06-15",
        personal_rating: 5,
        book: {
          title: "The Hobbit",
          categories: ["Fantasy"],
          page_count: 300,
          authors: ["J.R.R. Tolkien"],
        },
      },
      {
        status: "finished",
        finish_date: "2024-08-20",
        personal_rating: 4,
        book: {
          title: "1984",
          categories: ["Dystopian"],
          page_count: 328,
          authors: ["George Orwell"],
        },
      },
    ];

    const mockSessions = [
      {
        start_time: "2024-06-15T10:00:00",
        end_time: "2024-06-15T11:30:00",
        start_page: 0,
        end_page: 50,
      },
    ];

    it("should calculate total books read", () => {
      const result = calculateYearInReview(2024, mockBooks as any, mockSessions);
      expect(result.totalBooksRead).toBe(2);
    });

    it("should calculate total pages", () => {
      const result = calculateYearInReview(2024, mockBooks as any, mockSessions);
      expect(result.totalPages).toBe(628);
    });

    it("should calculate average rating", () => {
      const result = calculateYearInReview(2024, mockBooks as any, mockSessions);
      expect(result.averageRating).toBe(4.5);
    });

    it("should identify top genres", () => {
      const result = calculateYearInReview(2024, mockBooks as any, mockSessions);
      expect(result.topGenres).toHaveLength(2);
      expect(result.topGenres[0].genre).toBe("Fantasy");
    });

    it("should identify longest book", () => {
      const result = calculateYearInReview(2024, mockBooks as any, mockSessions);
      expect(result.longestBook?.title).toBe("1984");
      expect(result.longestBook?.pages).toBe(328);
    });

    it("should calculate monthly breakdown", () => {
      const result = calculateYearInReview(2024, mockBooks as any, mockSessions);
      expect(result.monthlyBreakdown).toHaveLength(12);
      expect(result.monthlyBreakdown[5].books).toBe(1); // June
      expect(result.monthlyBreakdown[7].books).toBe(1); // August
    });
  });

  describe("calculateGenreDistribution", () => {
    const mockBooks = [
      {
        status: "finished",
        book: { categories: ["Fantasy", "Adventure"] },
      },
      {
        status: "finished",
        book: { categories: ["Fantasy"] },
      },
      {
        status: "finished",
        book: { categories: ["Sci-Fi"] },
      },
    ];

    it("should calculate genre counts", () => {
      const result = calculateGenreDistribution(mockBooks as any);
      expect(result.find((g) => g.genre === "Fantasy")?.count).toBe(2);
      expect(result.find((g) => g.genre === "Sci-Fi")?.count).toBe(1);
    });

    it("should calculate percentages", () => {
      const result = calculateGenreDistribution(mockBooks as any);
      expect(result.find((g) => g.genre === "Fantasy")?.percentage).toBe(50);
    });

    it("should sort by count descending", () => {
      const result = calculateGenreDistribution(mockBooks as any);
      expect(result[0].genre).toBe("Fantasy");
    });
  });
});
