import { describe, it, expect } from "vitest";
import { buildSearchQuery, parseSearchQuery, searchInLibrary, searchInNotes } from "@/lib/search";

describe("Search Functionality", () => {
  describe("buildSearchQuery", () => {
    it("should build query with single filter", () => {
      const query = buildSearchQuery({ query: "fantasy" });
      expect(query).toBe("query:fantasy");
    });

    it("should build query with multiple filters", () => {
      const query = buildSearchQuery({
        query: "fantasy",
        authors: ["Tolkien"],
        minRating: 4,
      });
      expect(query).toContain("query:fantasy");
      expect(query).toContain("authors:Tolkien");
      expect(query).toContain("minRating:4");
    });
  });

  describe("parseSearchQuery", () => {
    it("should parse simple query", () => {
      const filters = parseSearchQuery("query:fantasy");
      expect(filters.query).toBe("fantasy");
    });

    it("should parse complex query", () => {
      const filters = parseSearchQuery("query:fantasy AND authors:Tolkien AND minRating:4");
      expect(filters.authors).toContain("Tolkien");
      expect(filters.minRating).toBe(4);
    });
  });

  describe("searchInLibrary", () => {
    const mockLibrary = [
      {
        id: "1",
        status: "finished",
        personal_rating: 5,
        book: {
          title: "The Hobbit",
          authors: ["J.R.R. Tolkien"],
          categories: ["Fantasy"],
          page_count: 300,
        },
      },
      {
        id: "2",
        status: "currently_reading",
        personal_rating: 4,
        book: {
          title: "1984",
          authors: ["George Orwell"],
          categories: ["Dystopian"],
          page_count: 328,
        },
      },
    ];

    it("should search by title", () => {
      const results = searchInLibrary(mockLibrary, { query: "hobbit" });
      expect(results).toHaveLength(1);
      expect(results[0].book.title).toBe("The Hobbit");
    });

    it("should search by author", () => {
      const results = searchInLibrary(mockLibrary, { query: "tolkien" });
      expect(results).toHaveLength(1);
      expect(results[0].book.authors).toContain("J.R.R. Tolkien");
    });

    it("should filter by status", () => {
      const results = searchInLibrary(mockLibrary, { query: "", status: ["finished"] });
      expect(results).toHaveLength(1);
      expect(results[0].status).toBe("finished");
    });

    it("should filter by rating", () => {
      const results = searchInLibrary(mockLibrary, { query: "", minRating: 5 });
      expect(results).toHaveLength(1);
      expect(results[0].personal_rating).toBe(5);
    });

    it("should filter by page count", () => {
      const results = searchInLibrary(mockLibrary, { query: "", minPages: 320 });
      expect(results).toHaveLength(1);
      expect(results[0].book.page_count).toBeGreaterThanOrEqual(320);
    });
  });

  describe("searchInNotes", () => {
    const mockNotes = [
      { id: "1", content: "Great insight about the ring", tags: ["important"] },
      { id: "2", content: "Interesting character development", tags: ["analysis"] },
    ];

    it("should search by content", () => {
      const results = searchInNotes(mockNotes, "ring");
      expect(results).toHaveLength(1);
      expect(results[0].content).toContain("ring");
    });

    it("should search by tags", () => {
      const results = searchInNotes(mockNotes, "important");
      expect(results).toHaveLength(1);
      expect(results[0].tags).toContain("important");
    });

    it("should be case insensitive", () => {
      const results = searchInNotes(mockNotes, "RING");
      expect(results).toHaveLength(1);
    });
  });
});
