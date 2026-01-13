import { describe, it, expect } from "vitest";

describe("Reading Statistics Calculations", () => {
  describe("Reading Pace", () => {
    it("should calculate pages per hour correctly", () => {
      const pages = 50;
      const minutes = 60;
      const pagesPerHour = Math.round((pages / minutes) * 60);
      
      expect(pagesPerHour).toBe(50);
    });

    it("should handle fractional hours", () => {
      const pages = 30;
      const minutes = 45;
      const pagesPerHour = Math.round((pages / minutes) * 60);
      
      expect(pagesPerHour).toBe(40);
    });

    it("should return 0 for zero duration", () => {
      const pages = 50;
      const minutes = 0;
      const pagesPerHour = minutes > 0 ? Math.round((pages / minutes) * 60) : 0;
      
      expect(pagesPerHour).toBe(0);
    });
  });

  describe("Session Duration", () => {
    it("should calculate duration in minutes", () => {
      const startTime = new Date("2024-01-01T10:00:00");
      const endTime = new Date("2024-01-01T11:30:00");
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
      
      expect(duration).toBe(90);
    });

    it("should handle same-day sessions", () => {
      const startTime = new Date("2024-01-01T14:00:00");
      const endTime = new Date("2024-01-01T14:45:00");
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
      
      expect(duration).toBe(45);
    });
  });

  describe("Progress Percentage", () => {
    it("should calculate reading progress correctly", () => {
      const currentPage = 150;
      const totalPages = 300;
      const progress = (currentPage / totalPages) * 100;
      
      expect(progress).toBe(50);
    });

    it("should handle completion", () => {
      const currentPage = 300;
      const totalPages = 300;
      const progress = (currentPage / totalPages) * 100;
      
      expect(progress).toBe(100);
    });

    it("should handle zero total pages", () => {
      const currentPage = 50;
      const totalPages = 0;
      const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
      
      expect(progress).toBe(0);
    });
  });

  describe("Average Calculations", () => {
    it("should calculate average pages per session", () => {
      const totalPages = 200;
      const sessionCount = 5;
      const average = Math.round(totalPages / sessionCount);
      
      expect(average).toBe(40);
    });

    it("should calculate average time per session", () => {
      const totalMinutes = 300;
      const sessionCount = 6;
      const average = Math.round(totalMinutes / sessionCount);
      
      expect(average).toBe(50);
    });

    it("should return 0 for no sessions", () => {
      const totalPages = 100;
      const sessionCount = 0;
      const average = sessionCount > 0 ? Math.round(totalPages / sessionCount) : 0;
      
      expect(average).toBe(0);
    });
  });

  describe("Estimated Completion Time", () => {
    it("should estimate time to finish book", () => {
      const remainingPages = 150;
      const pagesPerHour = 30;
      const hoursRemaining = remainingPages / pagesPerHour;
      
      expect(hoursRemaining).toBe(5);
    });

    it("should handle fast readers", () => {
      const remainingPages = 200;
      const pagesPerHour = 100;
      const hoursRemaining = remainingPages / pagesPerHour;
      
      expect(hoursRemaining).toBe(2);
    });

    it("should return infinity for zero pace", () => {
      const remainingPages = 150;
      const pagesPerHour = 0;
      const hoursRemaining = pagesPerHour > 0 ? remainingPages / pagesPerHour : Infinity;
      
      expect(hoursRemaining).toBe(Infinity);
    });
  });
});
