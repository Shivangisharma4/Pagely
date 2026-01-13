"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogSessionDialog } from "@/components/stats/log-session-dialog";
import { useReadingStats, useReadingSessions } from "@/hooks/use-reading-sessions";
import { BookOpen, Clock, TrendingUp, Target, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

type TimeRange = "week" | "month" | "year";

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [showLogDialog, setShowLogDialog] = useState(false);

  const { data: stats, isLoading } = useReadingStats(timeRange);
  const { data: sessions } = useReadingSessions(undefined, 10);

  const chartData = sessions?.slice(0, 7).reverse().map((session: any) => ({
    date: new Date(session.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    pages: session.end_page - session.start_page,
    minutes: Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000),
  })) || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reading Statistics</h1>
            <p className="text-muted-foreground">
              Track your reading progress and habits
            </p>
          </div>
          <Button onClick={() => setShowLogDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Log Session
          </Button>
        </div>

        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>

          <TabsContent value={timeRange} className="space-y-6 mt-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalSessions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Reading sessions logged
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pages Read</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalPages || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.averagePagesPerSession || 0} avg per session
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.floor((stats?.totalMinutes || 0) / 60)}h {(stats?.totalMinutes || 0) % 60}m
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.averageMinutesPerSession || 0} min avg
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reading Pace</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalMinutes && stats?.totalPages
                      ? Math.round(stats.totalPages / (stats.totalMinutes / 60))
                      : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    pages per hour
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pages Read</CardTitle>
                  <CardDescription>Last 7 sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pages" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reading Time</CardTitle>
                  <CardDescription>Last 7 sessions (minutes)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Your latest reading activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions?.slice(0, 5).map((session: any) => {
                    const duration = Math.round(
                      (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000
                    );
                    const pages = session.end_page - session.start_page;

                    return (
                      <div key={session.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="space-y-1">
                          <p className="font-medium">{session.book?.title || "Unknown Book"}</p>
                          <p className="text-sm text-muted-foreground">
                            Pages {session.start_page} - {session.end_page} ({pages} pages)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{duration} min</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.start_time).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {(!sessions || sessions.length === 0) && (
                    <p className="text-center text-muted-foreground py-8">
                      No reading sessions logged yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <LogSessionDialog open={showLogDialog} onOpenChange={setShowLogDialog} />
      </div>
    </MainLayout>
  );
}
