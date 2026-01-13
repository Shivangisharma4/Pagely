import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReadingSession,
  getReadingSessions,
  getReadingStats,
} from "@/app/actions/reading-sessions";
import { useToast } from "./use-toast";

export function useReadingSessions(bookId?: string, limit?: number) {
  return useQuery({
    queryKey: ["reading-sessions", bookId, limit],
    queryFn: async () => {
      const result = await getReadingSessions(bookId, limit);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateReadingSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Parameters<typeof createReadingSession>[0]) => {
      const result = await createReadingSession(data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["user-library"] });
      queryClient.invalidateQueries({ queryKey: ["reading-stats"] });
      toast({
        title: "Success",
        description: "Reading session recorded",
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

export function useReadingStats(timeRange: "week" | "month" | "year" = "month") {
  return useQuery({
    queryKey: ["reading-stats", timeRange],
    queryFn: async () => {
      const result = await getReadingStats(timeRange);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
