"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCreateNote } from "@/hooks/use-notes";

const noteSchema = z.object({
  content: z.string().min(1, "Content is required").max(5000),
  pageNumber: z.number().optional(),
  tagInput: z.string().optional(),
});

type NoteInput = z.infer<typeof noteSchema>;

interface NoteEditorProps {
  bookId: string;
  onSuccess?: () => void;
}

export function NoteEditor({ bookId, onSuccess }: NoteEditorProps) {
  const [tags, setTags] = useState<string[]>([]);
  const createNote = useCreateNote();

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
  });

  const tagInput = watch("tagInput");

  const addTag = () => {
    if (tagInput && tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setValue("tagInput", "");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onSubmit = async (data: NoteInput) => {
    await createNote.mutateAsync({
      bookId,
      content: data.content,
      tags,
      pageNumber: data.pageNumber,
    });
    reset();
    setTags([]);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Note</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Write your note here..."
          rows={6}
        />
        {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pageNumber">Page Number (Optional)</Label>
        <Input
          id="pageNumber"
          type="number"
          {...register("pageNumber", { valueAsNumber: true })}
          placeholder="e.g., 42"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagInput">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tagInput"
            {...register("tagInput")}
            placeholder="Add a tag..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={createNote.isPending}>
        {createNote.isPending ? "Saving..." : "Save Note"}
      </Button>
    </form>
  );
}
