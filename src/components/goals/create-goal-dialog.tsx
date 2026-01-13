"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateGoal } from "@/hooks/use-goals";

const goalSchema = z.object({
  type: z.enum(["books_per_year", "books_per_month", "pages_per_day", "pages_per_month"]),
  target: z.number().min(1, "Target must be at least 1"),
  startDate: z.string(),
  endDate: z.string(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

type GoalInput = z.infer<typeof goalSchema>;

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGoalDialog({ open, onOpenChange }: CreateGoalDialogProps) {
  const createGoal = useCreateGoal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      type: "books_per_year",
      target: 12,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split("T")[0],
    },
  });

  const goalType = watch("type");

  const onSubmit = async (data: GoalInput) => {
    await createGoal.mutateAsync({
      type: data.type,
      target: data.target,
      current: 0,
      start_date: data.startDate,
      end_date: data.endDate,
      is_active: true,
    });

    reset();
    onOpenChange(false);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Reading Goal</DialogTitle>
          <DialogDescription>
            Set a new reading goal to track your progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Goal Type</Label>
            <Select
              value={goalType}
              onValueChange={(value: any) => setValue("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="books_per_year">Books per Year</SelectItem>
                <SelectItem value="books_per_month">Books per Month</SelectItem>
                <SelectItem value="pages_per_day">Pages per Day</SelectItem>
                <SelectItem value="pages_per_month">Pages per Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              type="number"
              {...register("target", { valueAsNumber: true })}
            />
            {errors.target && (
              <p className="text-sm text-destructive">{errors.target.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {getGoalTypeLabel(goalType)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createGoal.isPending}>
              {createGoal.isPending ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
