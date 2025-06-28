import useUpdateWorkspace from "@/api/workspaces/use-update-workspace";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { FormEvent, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

interface EditWorkspaceModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspaceName: string;
  setWorkspaceName: (val: string) => void;
  workspaceId: Id<"workspaces">;
}

function EditWorkspaceModal(props: Readonly<EditWorkspaceModalProp>) {
  const { isOpen, setIsOpen, workspaceName, setWorkspaceName, workspaceId } =
    props;
  const [editedWorkspaceName, setEditedWorkspaceName] = useState(workspaceName);

  const {
    mutateAsync: update,
    isPending: isUpdatingWorkspace,
    error: updateError,
  } = useUpdateWorkspace({
    onSuccess: handleUpdateSuccess,
    onError: handleUpdateError,
    onSettled: handleUpdateSettled,
  });

  function handleUpdateSuccess() {
    console.log("successfully created workspace");
    toast("Successfully updated workspace!", {
      description: editedWorkspaceName,
    });
  }

  function handleUpdateError() {
    console.log("Something went wrong in updating the workspace");
    console.log("error: " + updateError);
  }

  function handleUpdateSettled() {
    console.log("Finished updating!");
    setIsOpen(false);
  }

  async function handleEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await update({ id: workspaceId, name: editedWorkspaceName });
    setWorkspaceName(editedWorkspaceName);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Workspace name</p>
            <p className="text-sm text-[#1264a3] hover:underline font-semibold">
              Edit
            </p>
          </div>
          <p className="text-sm">{workspaceName}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename this workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleEdit}>
          <Input
            value={editedWorkspaceName}
            disabled={isUpdatingWorkspace}
            onChange={(e) => setEditedWorkspaceName(e.target.value)}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder={`Workspace name e.g. "Work", "Personal", "Home"`}
          />
          <DialogFooter>
            <Button disabled={isUpdatingWorkspace}>Save</Button>
            <DialogClose asChild>
              <Button disabled={isUpdatingWorkspace} variant={"destructive"}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditWorkspaceModal;
