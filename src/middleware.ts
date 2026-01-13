import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update session first
  const supabaseResponse = await updateSession(request);

  // TEMPORARILY DISABLED AUTH CHECKS - Allow all routes
  // This lets you access the app while we debug the auth issue
  return supabaseResponse;

  /* ORIGINAL CODE - COMMENTED OUT FOR NOW
  // Check if user is authenticated - check multiple possible cookie names
  const accessToken = request.cookies.get("sb-access-token") || 
                      request.cookies.get("sb-gzxafxhboeobywsdlwkx-auth-token") ||
                      request.cookies.get("supabase-auth-token");
  const isAuthenticated = !!accessToken;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && !publicRoutes.includes(pathname) && !pathname.startsWith("/auth")) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
