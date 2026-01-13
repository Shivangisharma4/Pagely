"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Quote, Heart, Share2, Copy, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function QuotesPage() {
  // TODO: Fetch actual quotes from database
  const quotes: any[] = [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddQuote = () => {
    // TODO: Implement add quote functionality
    console.log("Adding quote...");
    setIsDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Quote className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Favorite Quotes</h1>
              <p className="text-muted-foreground">
                Your collection of memorable passages
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add a Quote</DialogTitle>
                <DialogDescription>
                  Save a memorable passage from your reading
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="quote">Quote</Label>
                  <Textarea
                    id="quote"
                    placeholder="Enter the quote text..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="book">Book Title</Label>
                  <Input id="book" placeholder="Book title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" placeholder="Author name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="page">Page</Label>
                    <Input id="page" type="number" placeholder="Page number" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddQuote}>Save Quote</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {quotes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Quote className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No quotes saved yet</h2>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Start saving your favorite passages from the books you read
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Quote
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {quotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                    <p className="text-lg italic pl-6">&ldquo;{quote.text}&rdquo;</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold">{quote.book}</p>
                    <p className="text-sm text-muted-foreground">
                      {quote.author} • Page {quote.page}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      {quote.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
