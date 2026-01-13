"use client";

import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TestAuthPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Auth Test Page</h1>
      
      <div className="space-y-2">
        <p><strong>User:</strong> {user ? "Logged in" : "Not logged in"}</p>
        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
        <p><strong>User ID:</strong> {user?.id || "N/A"}</p>
        <p><strong>Profile:</strong> {profile?.username || "N/A"}</p>
      </div>

      <div className="space-x-2">
        <Button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
        <Button onClick={() => router.push("/library")}>
          Go to Library
        </Button>
        <Button onClick={() => router.push("/discover")}>
          Go to Discover
        </Button>
      </div>

      <div className="mt-4">
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
          {JSON.stringify({ user, profile }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
