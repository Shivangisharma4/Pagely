"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserBook } from "@/hooks/use-user-books";
import type { ReadingStatus } from "@/types/database.types";

interface UpdateStatusDialogProps {
  userBookId: string;
  currentStatus: ReadingStatus;
  bookTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions: { value: ReadingStatus; label: string }[] = [
  { value: "want_to_read", label: "Want to Read" },
  { value: "currently_reading", label: "Currently Reading" },
  { value: "finished", label: "Finished" },
  { value: "on_hold", label: "On Hold" },
  { value: "did_not_finish", label: "Did Not Finish" },
];

export function UpdateStatusDialog({
  userBookId,
  currentStatus,
  bookTitle,
  open,
  onOpenChange,
}: UpdateStatusDialogProps) {
  const [status, setStatus] = useState<ReadingStatus>(currentStatus);
  const updateBook = useUpdateUserBook();

  const handleSubmit = async () => {
    const updates: any = { status };

    // Set dates based on status
    if (status === "currently_reading" && currentStatus !== "currently_reading") {
      updates.start_date = new Date().toISOString().split("T")[0];
    }

    if (status === "finished") {
      updates.finish_date = new Date().toISOString().split("T")[0];
    }

    await updateBook.mutateAsync({
      id: userBookId,
      data: updates,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Reading Status</DialogTitle>
          <DialogDescription>{bookTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ReadingStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <Button onClick={handleSubmit} disabled={updateBook.isPending}>
            {updateBook.isPending ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
