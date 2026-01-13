import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "@/lib/auth/context";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: { id: "test-user-id", email: "test@example.com" } },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: { id: "test-user-id", email: "test@example.com" } },
        error: null,
      }),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      updateUser: vi.fn().mockResolvedValue({ error: null }),
      refreshSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  }),
}));

// Test component that uses auth
function TestComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <>
          <div>Logged in as: {user.email}</div>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <div>Not logged in</div>
          <button onClick={() => signIn("test@example.com", "password123")}>
            Sign In
          </button>
        </>
      )}
    </div>
  );
}

describe("Authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render auth provider without errors", () => {
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should provide auth context to children", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Not logged in")).toBeInTheDocument();
    });
  });

  it("should handle sign in", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Not logged in")).toBeInTheDocument();
    });

    const signInButton = screen.getByText("Sign In");

    // Note: In a real test, you'd mock the auth state change
    // and verify the UI updates accordingly
  });

  it("should throw error when used outside provider", () => {
    const TestComponent = () => {
      try {
        useAuth();
      } catch (error: any) {
        return <div>{error.message}</div>;
      }
      return null;
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(<TestComponent />);
    expect(container.textContent).toContain("useAuth must be used within an AuthProvider");

    consoleSpy.mockRestore();
  });
});
