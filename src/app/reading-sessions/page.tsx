"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogSessionDialog } from "@/components/stats/log-session-dialog";
import { useReadingSessions } from "@/hooks/use-reading-sessions";
import { BookGridSkeleton } from "@/components/ui/loading-skeleton";
import { Plus, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function ReadingSessionsPage() {
  const [showLogDialog, setShowLogDialog] = useState(false);
  const { data: sessions, isLoading } = useReadingSessions(undefined, 50);

  const groupSessionsByDate = (sessions: any[]) => {
    const grouped: Record<string, any[]> = {};
    
    sessions.forEach((session) => {
      const date = new Date(session.start_time).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(session);
    });
    
    return grouped;
  };

  const groupedSessions = sessions ? groupSessionsByDate(sessions) : {};

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reading History</h1>
            <p className="text-muted-foreground">
              View all your reading sessions
            </p>
          </div>
          <Button onClick={() => setShowLogDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Log Session
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!sessions || sessions.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No reading sessions yet</p>
              <p className="text-muted-foreground mb-4">
                Start logging your reading sessions to track your progress
              </p>
              <Button onClick={() => setShowLogDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Log Your First Session
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && sessions && sessions.length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <motion.div
                key={date}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-muted-foreground">{date}</h2>
                <div className="space-y-3">
                  {dateSessions.map((session) => {
                    const duration = Math.round(
                      (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000
                    );
                    const pages = session.end_page - session.start_page;
                    const pagesPerHour = duration > 0 ? Math.round((pages / duration) * 60) : 0;

                    return (
                      <Card key={session.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold text-lg">
                                  {(session.book as any)?.title || "Unknown Book"}
                                </h3>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Pages:</span>
                                  <span>{session.start_page} → {session.end_page}</span>
                                  <span className="text-primary">({pages} pages)</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{duration} minutes</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Pace:</span>
                                  <span>{pagesPerHour} pages/hour</span>
                                </div>
                              </div>
                              
                              <p className="text-xs text-muted-foreground">
                                {new Date(session.start_time).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                                {" - "}
                                {new Date(session.end_time).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <LogSessionDialog open={showLogDialog} onOpenChange={setShowLogDialog} />
      </div>
    </MainLayout>
  );
}
