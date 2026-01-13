import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, updateNote, deleteNote, getNotes, searchNotes } from "@/app/actions/notes";
import { useToast } from "./use-toast";

export function useNotes(bookId: string) {
  return useQuery({
    queryKey: ["notes", bookId],
    queryFn: async () => {
      const result = await getNotes(bookId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchNotes(query: string, enabled = true) {
  return useQuery({
    queryKey: ["notes", "search", query],
    queryFn: async () => {
      const result = await searchNotes(query);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ bookId, content, tags, pageNumber }: { bookId: string; content: string; tags?: string[]; pageNumber?: number }) =>
      createNote(bookId, content, tags, pageNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({ title: "Success", description: "Note created" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ bookId, noteId, content, tags, pageNumber }: { bookId: string; noteId: string; content: string; tags?: string[]; pageNumber?: number }) =>
      updateNote(bookId, noteId, content, tags, pageNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({ title: "Success", description: "Note updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ bookId, noteId }: { bookId: string; noteId: string }) =>
      deleteNote(bookId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({ title: "Success", description: "Note deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
