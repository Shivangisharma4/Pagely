"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { BookCard } from "@/components/books/book-card";
import { Sparkles, TrendingUp, Users, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecommendationsPage() {
  // TODO: Fetch AI recommendations
  const recommendations: any[] = [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">AI Recommendations</h1>
            <p className="text-muted-foreground">
              Personalized book suggestions based on your reading history
            </p>
          </div>
        </div>

        <Tabs defaultValue="foryou" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="foryou">
              <Sparkles className="h-4 w-4 mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="similar">
              <Users className="h-4 w-4 mr-2" />
              Similar Readers
            </TabsTrigger>
            <TabsTrigger value="continue">
              <Clock className="h-4 w-4 mr-2" />
              Continue Reading
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foryou" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Based on Your Favorites</CardTitle>
                <CardDescription>
                  Books similar to ones you've loved
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Start rating books to get personalized recommendations!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recommendations.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trending">
            <Card>
              <CardHeader>
                <CardTitle>Trending Now</CardTitle>
                <CardDescription>
                  Popular books among Pagely users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Trending books coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="similar">
            <Card>
              <CardHeader>
                <CardTitle>Similar Readers</CardTitle>
                <CardDescription>
                  What people with similar taste are reading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Similar reader recommendations coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="continue">
            <Card>
              <CardHeader>
                <CardTitle>Continue Reading</CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  No books in progress yet!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
