import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCached, setCache, clearCache } from "@/lib/cache";

describe("Cache", () => {
  beforeEach(() => {
    clearCache();
  });

  it("should store and retrieve data", () => {
    setCache("test-key", { value: "test" });
    const result = getCached("test-key");
    expect(result).toEqual({ value: "test" });
  });

  it("should return null for non-existent key", () => {
    const result = getCached("non-existent");
    expect(result).toBeNull();
  });

  it("should expire data after TTL", async () => {
    setCache("test-key", { value: "test" }, 1); // 1 second TTL
    
    // Should exist immediately
    expect(getCached("test-key")).toEqual({ value: "test" });
    
    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 1100));
    
    // Should be expired
    expect(getCached("test-key")).toBeNull();
  });

  it("should clear specific key", () => {
    setCache("key1", "value1");
    setCache("key2", "value2");
    
    clearCache("key1");
    
    expect(getCached("key1")).toBeNull();
    expect(getCached("key2")).toBe("value2");
  });

  it("should clear all cache", () => {
    setCache("key1", "value1");
    setCache("key2", "value2");
    
    clearCache();
    
    expect(getCached("key1")).toBeNull();
    expect(getCached("key2")).toBeNull();
  });
});
