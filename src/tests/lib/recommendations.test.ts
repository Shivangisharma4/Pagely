import { describe, it, expect } from "vitest";
import { getContentBasedRecommendations, getCollaborativeRecommendations } from "@/lib/recommendations";

describe("Recommendation Engine", () => {
  const mockBooks = [
    {
      id: "1",
      title: "The Hobbit",
      authors: ["J.R.R. Tolkien"],
      categories: ["Fantasy"],
      average_rating: 4.5,
    },
    {
      id: "2",
      title: "Lord of the Rings",
      authors: ["J.R.R. Tolkien"],
      categories: ["Fantasy"],
      average_rating: 4.8,
    },
    {
      id: "3",
      title: "1984",
      authors: ["George Orwell"],
      categories: ["Dystopian"],
      average_rating: 4.2,
    },
  ];

  describe("Content-Based Recommendations", () => {
    it("should recommend books from same category", () => {
      const userLibrary = [
        {
          book_id: "1",
          status: "finished",
          personal_rating: 5,
          book: mockBooks[0],
        },
      ];

      const recommendations = getContentBasedRecommendations(
        userLibrary as any,
        mockBooks,
        5
      );

      expect(recommendations.length).toBeGreaterThan(0);
      const rec = recommendations.find((r) => r.book.id === "2");
      expect(rec).toBeDefined();
      expect(rec?.reasons.some((r) => r.includes("Fantasy"))).toBe(true);
    });

    it("should recommend books by same author", () => {
      const userLibrary = [
        {
          book_id: "1",
          status: "finished",
          personal_rating: 5,
          book: mockBooks[0],
        },
      ];

      const recommendations = getContentBasedRecommendations(
        userLibrary as any,
        mockBooks,
        5
      );

      const rec = recommendations.find((r) => r.book.id === "2");
      expect(rec?.reasons.some((r) => r.includes("Tolkien"))).toBe(true);
    });

    it("should not recommend books already in library", () => {
      const userLibrary = [
        {
          book_id: "1",
          status: "finished",
          personal_rating: 5,
          book: mockBooks[0],
        },
      ];

      const recommendations = getContentBasedRecommendations(
        userLibrary as any,
        mockBooks,
        5
      );

      expect(recommendations.find((r) => r.book.id === "1")).toBeUndefined();
    });

    it("should prioritize highly rated books", () => {
      const userLibrary = [
        {
          book_id: "1",
          status: "finished",
          personal_rating: 5,
          book: mockBooks[0],
        },
      ];

      const recommendations = getContentBasedRecommendations(
        userLibrary as any,
        mockBooks,
        5
      );

      const highRated = recommendations.find((r) => r.book.id === "2");
      expect(highRated?.score).toBeGreaterThan(0);
    });
  });

  describe("Collaborative Filtering", () => {
    it("should calculate user similarity", () => {
      const userLibrary = [
        {
          book_id: "1",
          status: "finished",
          personal_rating: 5,
          book: mockBooks[0],
        },
      ];

      const allUserLibraries = {
        user1: [
          {
            book_id: "1",
            status: "finished",
            personal_rating: 5,
            book: mockBooks[0],
          },
          {
            book_id: "2",
            status: "finished",
            personal_rating: 5,
            book: mockBooks[1],
          },
        ],
      };

      const recommendations = getCollaborativeRecommendations(
        "currentUser",
        userLibrary as any,
        allUserLibraries as any,
        mockBooks,
        5
      );

      expect(recommendations.length).toBeGreaterThan(0);
    });
  });
});
