import { describe, it, expect } from "vitest";
import {
  parseGoodreadsCSV,
  matchBookByISBN,
  matchBookByMetadata,
  mapGoodreadsStatus,
  validateImportData,
} from "@/lib/import-export";

describe("Import/Export", () => {
  describe("parseGoodreadsCSV", () => {
    it("should parse CSV with headers", () => {
      const csv = `Title,Author,ISBN\n"The Hobbit","J.R.R. Tolkien","1234567890"`;
      const result = parseGoodreadsCSV(csv);
      
      expect(result).toHaveLength(1);
      expect(result[0].Title).toBe("The Hobbit");
      expect(result[0].Author).toBe("J.R.R. Tolkien");
    });

    it("should handle quoted values with commas", () => {
      const csv = `Title,Author\n"Book, The","Author, Name"`;
      const result = parseGoodreadsCSV(csv);
      
      expect(result[0].Title).toBe("Book, The");
      expect(result[0].Author).toBe("Author, Name");
    });
  });

  describe("matchBookByISBN", () => {
    const existingBooks = [
      { isbn13: "9781234567890", isbn10: "1234567890", title: "The Hobbit" },
    ];

    it("should match by ISBN13", () => {
      const csvBook = { Title: "The Hobbit", Author: "Tolkien", ISBN13: "9781234567890" };
      const match = matchBookByISBN(csvBook, existingBooks);
      
      expect(match).toBeDefined();
      expect(match.title).toBe("The Hobbit");
    });

    it("should match by ISBN10", () => {
      const csvBook = { Title: "The Hobbit", Author: "Tolkien", ISBN: "1234567890" };
      const match = matchBookByISBN(csvBook, existingBooks);
      
      expect(match).toBeDefined();
    });

    it("should return null for no match", () => {
      const csvBook = { Title: "Unknown", Author: "Unknown", ISBN13: "0000000000000" };
      const match = matchBookByISBN(csvBook, existingBooks);
      
      expect(match).toBeNull();
    });
  });

  describe("matchBookByMetadata", () => {
    const existingBooks = [
      { title: "The Hobbit", authors: ["J.R.R. Tolkien"] },
    ];

    it("should match by title and author", () => {
      const csvBook = { Title: "The Hobbit", Author: "J.R.R. Tolkien" };
      const match = matchBookByMetadata(csvBook, existingBooks);
      
      expect(match).toBeDefined();
      expect(match.title).toBe("The Hobbit");
    });

    it("should handle partial matches", () => {
      const csvBook = { Title: "Hobbit", Author: "Tolkien" };
      const match = matchBookByMetadata(csvBook, existingBooks);
      
      expect(match).toBeDefined();
    });

    it("should be case insensitive", () => {
      const csvBook = { Title: "THE HOBBIT", Author: "tolkien" };
      const match = matchBookByMetadata(csvBook, existingBooks);
      
      expect(match).toBeDefined();
    });
  });

  describe("mapGoodreadsStatus", () => {
    it("should map read to finished", () => {
      expect(mapGoodreadsStatus("read")).toBe("finished");
      expect(mapGoodreadsStatus("finished")).toBe("finished");
    });

    it("should map currently-reading", () => {
      expect(mapGoodreadsStatus("currently-reading")).toBe("currently_reading");
    });

    it("should map to-read", () => {
      expect(mapGoodreadsStatus("to-read")).toBe("want_to_read");
      expect(mapGoodreadsStatus("want-to-read")).toBe("want_to_read");
    });

    it("should default to want_to_read", () => {
      expect(mapGoodreadsStatus("unknown")).toBe("want_to_read");
    });
  });

  describe("validateImportData", () => {
    it("should validate correct data", () => {
      const books = [
        { Title: "The Hobbit", Author: "Tolkien", "My Rating": "5" },
      ];
      const result = validateImportData(books);
      
      expect(result.success).toBe(1);
      expect(result.failed).toBe(0);
    });

    it("should catch missing title", () => {
      const books = [
        { Title: "", Author: "Tolkien" },
      ];
      const result = validateImportData(books);
      
      expect(result.failed).toBe(1);
      expect(result.errors[0].error).toContain("Missing title");
    });

    it("should catch invalid rating", () => {
      const books = [
        { Title: "Book", Author: "Author", "My Rating": "10" },
      ];
      const result = validateImportData(books);
      
      expect(result.failed).toBe(1);
      expect(result.errors[0].error).toContain("Invalid rating");
    });
  });
});
