"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { StickyNote, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotesPage() {
  // TODO: Fetch actual notes
  const notes: any[] = [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StickyNote className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Book Notes & Highlights</h1>
              <p className="text-muted-foreground">
                Your thoughts, quotes, and highlights
              </p>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-10" />
          </div>
        </div>

        {notes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <StickyNote className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No notes yet</h2>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Start adding notes, highlights, and thoughts about the books you're reading
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{note.bookTitle}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        Page {note.page}
                      </CardDescription>
                    </div>
                    <Badge variant={note.type === "highlight" ? "default" : "secondary"}>
                      {note.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
