import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGoal, updateGoal, deleteGoal, getUserGoals } from "@/app/actions/goals";
import { useToast } from "./use-toast";
import type { Database } from "@/types/database.types";

type GoalUpdate = Database["public"]["Tables"]["reading_goals"]["Update"];

export function useUserGoals(activeOnly = false) {
  return useQuery({
    queryKey: ["user-goals", activeOnly],
    queryFn: async () => {
      const result = await getUserGoals(activeOnly);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Parameters<typeof createGoal>[0]) => {
      const result = await createGoal(data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-goals"] });
      toast({
        title: "Success",
        description: "Goal created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GoalUpdate }) => {
      const result = await updateGoal(id, data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-goals"] });
      toast({
        title: "Success",
        description: "Goal updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteGoal(id);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-goals"] });
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
