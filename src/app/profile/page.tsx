"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/context";
import { useReadingStats } from "@/hooks/use-reading-sessions";
import { useUserLibrary } from "@/hooks/use-user-books";
import { Settings, BookOpen, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const { data: stats } = useReadingStats("year");
  const { data: library } = useUserLibrary();

  const currentlyReading = library?.filter((b) => b.status === "currently_reading").length || 0;
  const finished = library?.filter((b) => b.status === "finished").length || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.profile_image_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">
                      {profile?.display_name || profile?.username}
                    </h1>
                    {!profile?.is_profile_public && (
                      <Badge variant="secondary">Private</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                  {profile?.location && (
                    <p className="text-sm text-muted-foreground mt-1">📍 {profile.location}</p>
                  )}
                </div>

                {profile?.bio && (
                  <p className="text-sm">{profile.bio}</p>
                )}

                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Books in Library</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{library?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {currentlyReading} currently reading
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Books Finished</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{finished}</div>
              <p className="text-xs text-muted-foreground">
                This year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pages Read</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPages || 0}</div>
              <p className="text-xs text-muted-foreground">
                This year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor((stats?.totalMinutes || 0) / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">
                This year
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Currently Reading */}
        {profile?.show_currently_reading && currentlyReading > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Currently Reading</CardTitle>
              <CardDescription>Books in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {library
                  ?.filter((b) => b.status === "currently_reading")
                  .slice(0, 3)
                  .map((userBook) => (
                    <div key={userBook.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{userBook.book.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {userBook.book.authors?.join(", ")}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {userBook.current_page} / {userBook.book.page_count || "?"} pages
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Member since</span>
              <span className="text-sm text-muted-foreground">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
