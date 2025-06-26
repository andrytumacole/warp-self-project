"use client";

import { useCreateWorkspaceModal } from "@/app/atom-states/use-create-workspace-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function CreateWorkspaceModal() {
  const [isModalOpen, setIsModalOpen] = useCreateWorkspaceModal();

  function handleClose() {
    setIsModalOpen(false);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-lg [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkspaceModal;
