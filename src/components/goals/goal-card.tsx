"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Target, TrendingUp, Calendar } from "lucide-react";
import type { Database } from "@/types/database.types";

type Goal = Database["public"]["Tables"]["reading_goals"]["Row"];

interface GoalCardProps {
  goal: Goal;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
  const isCompleted = goal.current >= goal.target;
  
  const daysRemaining = Math.ceil(
    (new Date(goal.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case "books_per_year":
        return "Books per Year";
      case "books_per_month":
        return "Books per Month";
      case "pages_per_day":
        return "Pages per Day";
      case "pages_per_month":
        return "Pages per Month";
      default:
        return type;
    }
  };

  const getGoalUnit = (type: string) => {
    return type.includes("books") ? "books" : "pages";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {getGoalTypeLabel(goal.type)}
          </CardTitle>
          <CardDescription>
            {new Date(goal.start_date).toLocaleDateString()} - {new Date(goal.end_date).toLocaleDateString()}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && <Badge variant="default">Completed</Badge>}
          {!goal.is_active && <Badge variant="secondary">Inactive</Badge>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit Goal</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                Delete Goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {goal.current} / {goal.target} {getGoalUnit(goal.type)}
            </span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{Math.round(progress)}% complete</span>
            {!isCompleted && daysRemaining > 0 && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {daysRemaining} days left
              </span>
            )}
          </div>
        </div>

        {!isCompleted && goal.is_active && (
          <div className="rounded-lg bg-muted p-3 space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>To reach your goal</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {daysRemaining > 0
                ? `Read ${Math.ceil((goal.target - goal.current) / daysRemaining)} ${getGoalUnit(goal.type)} per day`
                : "Goal period has ended"}
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="rounded-lg bg-primary/10 p-3 text-center">
            <p className="text-sm font-medium text-primary">
              🎉 Congratulations! Goal completed!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
