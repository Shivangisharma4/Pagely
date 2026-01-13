import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createList,
  updateList,
  deleteList,
  addBookToList,
  removeBookFromList,
  reorderBooksInList,
  getUserLists,
} from "@/app/actions/lists";
import { useToast } from "./use-toast";

export function useUserLists() {
  return useQuery({
    queryKey: ["user-lists"],
    queryFn: async () => {
      const result = await getUserLists();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ name, description, isPublic }: { name: string; description?: string; isPublic?: boolean }) =>
      createList(name, description, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      toast({ title: "Success", description: "List created" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ listId, name, description, isPublic }: { listId: string; name: string; description?: string; isPublic?: boolean }) =>
      updateList(listId, name, description, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      toast({ title: "Success", description: "List updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      toast({ title: "Success", description: "List deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useAddBookToList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ listId, bookId }: { listId: string; bookId: string }) =>
      addBookToList(listId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      toast({ title: "Success", description: "Book added to list" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useRemoveBookFromList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ listId, bookId }: { listId: string; bookId: string }) =>
      removeBookFromList(listId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      toast({ title: "Success", description: "Book removed from list" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useReorderBooks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, bookIds }: { listId: string; bookIds: string[] }) =>
      reorderBooksInList(listId, bookIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-lists"] });
    },
  });
}
