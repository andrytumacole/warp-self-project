"use client";

import { useCreateWorkspaceModal } from "@/app/atom-states/use-create-workspace-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { FormEvent, useState } from "react";
import { useCreateWorkspace } from "@/app/api/workspaces/use-create-workspace";
import { useRouter } from "next/navigation";

function CreateWorkspaceModal() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useCreateWorkspaceModal();
  const [workspaceInfo, setWorkspaceInfo] = useState("");
  const { isPending, error, mutateAsync } = useCreateWorkspace({
    onSuccess: handleSuccess,
    onError: handleError,
    onSettled: handleSettled,
  });

  function handleClose() {
    setIsModalOpen(false);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const workspaceId = await mutateAsync({
      name: workspaceInfo,
    });
    console.log(workspaceId);
    router.replace(`/workspace/${workspaceId}`);
  }

  function handleSuccess() {
    console.log("successfully created workspace");
    toast("Successfully created workspace!", {
      description: workspaceInfo,
    });
  }

  function handleError() {
    console.log("Something went wrong in creating the workspace");
    console.log("error: " + error);
  }

  function handleSettled() {
    console.log("Finished! You can now proceed");
    setIsModalOpen(false);
    setWorkspaceInfo("");
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
            disabled={isPending}
            onChange={(e) => setWorkspaceInfo(e.target.value)}
            placeholder={`Workspace name e.g. "Work", "Personal", "Home"`}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkspaceModal;
