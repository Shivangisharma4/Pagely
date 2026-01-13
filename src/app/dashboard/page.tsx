"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReadingStreak } from "@/components/stats/reading-streak";
import { BookOpen, Search, Target, TrendingUp, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { user, profile } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section with Vintage Styling */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="py-6">
            <h1 className="text-4xl font-heading font-bold text-primary dark:text-foreground mb-2" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              Welcome to Your Library
            </h1>
            <p className="text-lg text-muted-foreground font-accent italic">
              Good day, {profile?.display_name || profile?.username || "Reader"}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>

        {/* Ornamental Divider */}
        <div className="flex items-center justify-center">
          <Image
            src="/decorations/ornamental-divider.svg"
            alt=""
            width={200}
            height={20}
            className="opacity-40"
            priority
          />
        </div>

        {/* Reading Streak Component */}
        <ReadingStreak />

        {/* Ornamental Divider */}
        <div className="flex items-center justify-center">
          <Image
            src="/decorations/ornamental-divider.svg"
            alt=""
            width={200}
            height={20}
            className="opacity-40"
          />
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-2xl font-heading font-semibold mb-4 text-primary">Quick Actions</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            <Card className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Your Library</CardTitle>
                    <CardDescription>Manage your collection</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/library">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Library
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-secondary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Search className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>Discover Books</CardTitle>
                    <CardDescription>Find your next read</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/discover">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Books
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-accent/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Reading Goals</CardTitle>
                    <CardDescription>Track your progress</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/reading-goals">
                    <Target className="h-4 w-4 mr-2" />
                    View Goals
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>View your insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/stats">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Stats
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-red-500/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <CardTitle>Favorites</CardTitle>
                    <CardDescription>Your loved books</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/favorites">
                    <Heart className="h-4 w-4 mr-2" />
                    View Favorites
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-purple-500/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle>AI Picks</CardTitle>
                    <CardDescription>Personalized picks</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full mt-2" variant="outline">
                  <Link href="/recommendations">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span className="truncate">Get Picks</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
