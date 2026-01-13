import { describe, it, expect } from "vitest";
import {
  signUpSchema,
  signInSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "@/lib/schemas/auth.schemas";

describe("Auth Schemas", () => {
  describe("signUpSchema", () => {
    it("should validate correct sign up data", () => {
      const validData = {
        email: "test@example.com",
        username: "testuser",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        username: "testuser",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject short username", () => {
      const invalidData = {
        email: "test@example.com",
        username: "ab",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject weak password", () => {
      const invalidData = {
        email: "test@example.com",
        username: "testuser",
        password: "weak",
        confirmPassword: "weak",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject mismatched passwords", () => {
      const invalidData = {
        email: "test@example.com",
        username: "testuser",
        password: "Password123",
        confirmPassword: "DifferentPassword123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject username with special characters", () => {
      const invalidData = {
        email: "test@example.com",
        username: "test-user!",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("signInSchema", () => {
    it("should validate correct sign in data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = signInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordRequestSchema", () => {
    it("should validate correct email", () => {
      const validData = {
        email: "test@example.com",
      };

      const result = resetPasswordRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
      };

      const result = resetPasswordRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("should validate correct password reset data", () => {
      const validData = {
        password: "NewPassword123",
        confirmPassword: "NewPassword123",
      };

      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject weak password", () => {
      const invalidData = {
        password: "weak",
        confirmPassword: "weak",
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject mismatched passwords", () => {
      const invalidData = {
        password: "NewPassword123",
        confirmPassword: "DifferentPassword123",
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
