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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateList } from "@/hooks/use-lists";

const listSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean(),
});

type ListInput = z.infer<typeof listSchema>;

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateListDialog({ open, onOpenChange }: CreateListDialogProps) {
  const createList = useCreateList();

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<ListInput>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: true,
    },
  });

  const onSubmit = async (data: ListInput) => {
    await createList.mutateAsync(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Book List</DialogTitle>
          <DialogDescription>
            Create a custom list to organize your books
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">List Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., Summer Reading 2024" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your list..."
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public List</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to view this list
              </p>
            </div>
            <Switch
              checked={watch("isPublic")}
              onCheckedChange={(checked) => setValue("isPublic", checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createList.isPending}>
              {createList.isPending ? "Creating..." : "Create List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
