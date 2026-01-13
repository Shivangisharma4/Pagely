"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateListDialog } from "@/components/lists/create-list-dialog";
import { useUserLists, useDeleteList } from "@/hooks/use-lists";
import { Plus, List, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Link from "next/link";

export default function ListsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: lists, isLoading } = useUserLists();
  const deleteList = useDeleteList();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Lists</h1>
            <p className="text-muted-foreground">
              Organize your books into custom collections
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create List
          </Button>
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!lists || lists.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <List className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No lists yet</p>
              <p className="text-muted-foreground mb-4">
                Create your first list to organize your books
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First List
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && lists && lists.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {lists.map((list: any) => (
              <motion.div key={list.id} variants={staggerItem}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <List className="h-5 w-5" />
                          {list.name}
                        </CardTitle>
                        {list.description && (
                          <CardDescription className="mt-2">
                            {list.description}
                          </CardDescription>
                        )}
                      </div>
                      {list.is_public ? (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {list.book_ids?.length || 0} books
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/lists/${list.id}`}>View</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteList.mutate(list.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <CreateListDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      </div>
    </MainLayout>
  );
}
