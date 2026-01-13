"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateGoalDialog } from "@/components/goals/create-goal-dialog";
import { GoalCard } from "@/components/goals/goal-card";
import { useUserGoals, useDeleteGoal } from "@/hooks/use-goals";
import { Plus, Target } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function ReadingGoalsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "all">("active");

  const { data: activeGoals, isLoading: isLoadingActive } = useUserGoals(true);
  const { data: allGoals, isLoading: isLoadingAll } = useUserGoals(false);
  const deleteGoal = useDeleteGoal();

  const goals = activeTab === "active" ? activeGoals : allGoals;
  const isLoading = activeTab === "active" ? isLoadingActive : isLoadingAll;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reading Goals</h1>
            <p className="text-muted-foreground">
              Set and track your reading goals
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Goal
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="active">
              Active Goals ({activeGoals?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Goals ({allGoals?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading && (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-2 w-full bg-muted animate-pulse rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && (!goals || goals.length === 0) && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No goals yet</p>
                  <p className="text-muted-foreground mb-4 text-center">
                    {activeTab === "active"
                      ? "Create your first reading goal to start tracking your progress"
                      : "You haven't created any reading goals yet"}
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            )}

            {!isLoading && goals && goals.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid gap-6 md:grid-cols-2"
              >
                {goals.map((goal) => (
                  <motion.div key={goal.id} variants={staggerItem}>
                    <GoalCard
                      goal={goal}
                      onDelete={() => deleteGoal.mutate(goal.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        <CreateGoalDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </MainLayout>
  );
}
