import { describe, it, expect, vi } from "vitest";
import { getAriaLabel, handleKeyboardNavigation } from "@/lib/accessibility";

describe("Accessibility", () => {
  describe("getAriaLabel", () => {
    it("should return correct label", () => {
      expect(getAriaLabel("close-button")).toBe("Close");
      expect(getAriaLabel("menu-button")).toBe("Open menu");
    });

    it("should include context", () => {
      expect(getAriaLabel("close-button", "modal")).toBe("Close modal");
    });

    it("should return element name if not found", () => {
      expect(getAriaLabel("unknown")).toBe("unknown");
    });
  });

  describe("handleKeyboardNavigation", () => {
    it("should call handler for matching key", () => {
      const handler = vi.fn();
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      
      handleKeyboardNavigation(event, { Enter: handler });
      
      expect(handler).toHaveBeenCalled();
    });

    it("should not call handler for non-matching key", () => {
      const handler = vi.fn();
      const event = new KeyboardEvent("keydown", { key: "Escape" });
      
      handleKeyboardNavigation(event, { Enter: handler });
      
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
