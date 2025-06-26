"use client";

import { useCreateWorkspaceModal } from "@/app/atom-states/use-create-workspace-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormEvent, useState } from "react";

function CreateWorkspaceModal() {
  const [isModalOpen, setIsModalOpen] = useCreateWorkspaceModal();
  const [workspaceInfo, setWorkspaceInfo] = useState("");

  function handleClose() {
    setIsModalOpen(false);
  }

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(workspaceInfo);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-lg [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-2.5" onSubmit={handleCreate}>
          <Input
            value={workspaceInfo}
            required
            autoFocus
            minLength={3}
            onChange={(e) => setWorkspaceInfo(e.target.value)}
            placeholder={`Workspace name e.g. "Work", "Personal", "Home"`}
          />
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkspaceModal;
