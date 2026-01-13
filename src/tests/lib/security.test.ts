import { describe, it, expect } from "vitest";
import {
  sanitizeHTML,
  escapeHTML,
  validateEmail,
  validateUsername,
  validatePasswordStrength,
  checkRateLimit,
} from "@/lib/security";

describe("Security", () => {
  describe("sanitizeHTML", () => {
    it("should remove script tags", () => {
      const result = sanitizeHTML('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
    });

    it("should allow safe tags", () => {
      const result = sanitizeHTML('<p>Hello <strong>world</strong></p>');
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
    });
  });

  describe("escapeHTML", () => {
    it("should escape special characters", () => {
      const result = escapeHTML('<script>alert("xss")</script>');
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
    });

    it("should reject invalid email", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
    });
  });

  describe("validateUsername", () => {
    it("should validate correct username", () => {
      expect(validateUsername("user123")).toBe(true);
      expect(validateUsername("test_user")).toBe(true);
    });

    it("should reject invalid username", () => {
      expect(validateUsername("ab")).toBe(false); // Too short
      expect(validateUsername("user@name")).toBe(false); // Invalid char
    });
  });

  describe("validatePasswordStrength", () => {
    it("should validate strong password", () => {
      const result = validatePasswordStrength("Strong123");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject weak password", () => {
      const result = validatePasswordStrength("weak");
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("checkRateLimit", () => {
    it("should allow requests within limit", () => {
      const attempts = new Map();
      const result = checkRateLimit("test-key", 5, 60000, attempts);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it("should block requests exceeding limit", () => {
      const attempts = new Map();
      
      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit("test-key", 5, 60000, attempts);
      }
      
      // 6th request should be blocked
      const result = checkRateLimit("test-key", 5, 60000, attempts);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });
});
