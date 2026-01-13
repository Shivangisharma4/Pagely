"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Trophy, Target, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function ChallengesPage() {
  // TODO: Fetch actual challenges from database
  const challenges: any[] = [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold">Reading Challenges</h1>
            <p className="text-muted-foreground">
              Join challenges and compete with other readers
            </p>
          </div>
        </div>

        {challenges.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Active Challenges</h2>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Reading challenges will appear here. Create your own or join community challenges to stay motivated!
              </p>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Create Your First Challenge
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <Badge
                      variant={
                        challenge.difficulty === "Hard"
                          ? "destructive"
                          : challenge.difficulty === "Medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="text-muted-foreground">
                        {challenge.progress}/{challenge.total}
                      </span>
                    </div>
                    <Progress
                      value={(challenge.progress / challenge.total) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{challenge.participants.toLocaleString()} joined</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{challenge.timeLeft}</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    {challenge.progress > 0 ? "Continue" : "Join Challenge"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Create Your Own Challenge</CardTitle>
            <CardDescription>
              Set a personal reading goal and invite friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Create Custom Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
