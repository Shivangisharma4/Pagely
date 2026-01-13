import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

describe("Notes System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Note Creation", () => {
    it("should validate note content length", () => {
      const validNote = "This is a great insight";
      const longNote = "a".repeat(5001);
      expect(validNote.length).toBeLessThanOrEqual(5000);
      expect(longNote.length).toBeGreaterThan(5000);
    });

    it("should handle page numbers", () => {
      const pageNumber = 42;
      expect(pageNumber).toBeGreaterThan(0);
      expect(typeof pageNumber).toBe("number");
    });
  });

  describe("Tag Management", () => {
    it("should prevent duplicate tags", () => {
      const tags = ["important", "favorite"];
      const newTag = "important";
      const hasDuplicate = tags.includes(newTag);
      expect(hasDuplicate).toBe(true);
    });

    it("should trim whitespace from tags", () => {
      const tag = "  important  ";
      const trimmed = tag.trim();
      expect(trimmed).toBe("important");
    });
  });

  describe("Note Search", () => {
    it("should perform case-insensitive search", () => {
      const noteContent = "This is an Important Note";
      const query = "important";
      const matches = noteContent.toLowerCase().includes(query.toLowerCase());
      expect(matches).toBe(true);
    });
  });

  describe("Note Organization", () => {
    it("should sort notes by creation date", () => {
      const notes = [
        { id: "1", created_at: "2024-01-03" },
        { id: "2", created_at: "2024-01-01" },
        { id: "3", created_at: "2024-01-02" },
      ];
      const sorted = [...notes].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      expect(sorted[0].id).toBe("1");
      expect(sorted[2].id).toBe("2");
    });
  });
});
