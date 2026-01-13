"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserLibrary } from "@/hooks/use-user-books";
import { useReadingSessions } from "@/hooks/use-reading-sessions";
import { calculateYearInReview, calculateGenreDistribution } from "@/lib/analytics";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { BookOpen, TrendingUp, Award, Calendar } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AnalyticsPage() {
  const { data: library } = useUserLibrary();
  const { data: sessions } = useReadingSessions(undefined, 1000);

  const currentYear = new Date().getFullYear();
  const yearInReview = library && sessions
    ? calculateYearInReview(currentYear, library as any, sessions as any)
    : null;

  const genreDistribution = library ? calculateGenreDistribution(library as any) : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Your reading patterns and statistics
          </p>
        </div>

        {yearInReview && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Books Read</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{yearInReview.totalBooksRead}</div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pages Read</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{yearInReview.totalPages.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{yearInReview.averageRating}</div>
                  <p className="text-xs text-muted-foreground">Out of 5 stars</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reading Streak</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{yearInReview.readingStreak}</div>
                  <p className="text-xs text-muted-foreground">Days in a row</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Genre Distribution</CardTitle>
                  <CardDescription>Your reading preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genreDistribution.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.genre}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {genreDistribution.slice(0, 5).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Reading</CardTitle>
                  <CardDescription>Books finished per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yearInReview.monthlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="books" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Authors</CardTitle>
                <CardDescription>Your most-read authors this year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {yearInReview.topAuthors.map((author, index) => (
                    <div key={author.author} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{author.author}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {author.count} {author.count === 1 ? "book" : "books"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}
