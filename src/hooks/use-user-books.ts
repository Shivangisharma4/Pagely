import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBookToLibrary,
  updateUserBook,
  removeBookFromLibrary,
  getUserLibrary,
  updateReadingProgress,
} from "@/app/actions/user-books";
import type { ReadingStatus } from "@/types/database.types";
import type { Database } from "@/types/database.types";
import { useToast } from "./use-toast";

type UserBookUpdate = Database["public"]["Tables"]["user_books"]["Update"];

export function useUserLibrary(status?: ReadingStatus) {
  return useQuery({
    queryKey: ["user-library", status],
    queryFn: async () => {
      const result = await getUserLibrary(status);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useAddBookToLibrary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      bookId,
      data,
    }: {
      bookId: string;
      data: Parameters<typeof addBookToLibrary>[1];
    }) => {
      const result = await addBookToLibrary(bookId, data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-library"] });
      toast({
        title: "Success",
        description: "Book added to your library",
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

export function useUpdateUserBook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UserBookUpdate }) => {
      const result = await updateUserBook(id, data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-library"] });
      toast({
        title: "Success",
        description: "Book updated successfully",
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

export function useRemoveBookFromLibrary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await removeBookFromLibrary(id);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-library"] });
      toast({
        title: "Success",
        description: "Book removed from your library",
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

export function useUpdateReadingProgress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      currentPage,
      totalPages,
    }: {
      id: string;
      currentPage: number;
      totalPages?: number;
    }) => {
      const result = await updateReadingProgress(id, currentPage, totalPages);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-library"] });
      queryClient.invalidateQueries({ queryKey: ["reading-sessions"] });
      toast({
        title: "Success",
        description: "Reading progress updated",
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
