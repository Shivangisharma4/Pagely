"use client";

import { Flame, Calendar, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ReadingStreak() {
  // TODO: Fetch actual streak data from database
  const currentStreak = 0;
  const longestStreak = 0;
  const daysThisWeek = [false, false, false, false, false, false, false];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Reading Streak
        </CardTitle>
        <CardDescription>Keep your reading momentum going!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{longestStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">This Week</div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div key={day} className="text-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-1 ${
                    daysThisWeek[index]
                      ? "bg-orange-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {daysThisWeek[index] ? (
                    <Flame className="h-4 w-4" />
                  ) : (
                    <Calendar className="h-4 w-4" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{day}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Weekly Goal</span>
            <span className="font-medium">0/7 days</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span>Start reading today to begin your streak!</span>
        </div>
      </CardContent>
    </Card>
  );
}
