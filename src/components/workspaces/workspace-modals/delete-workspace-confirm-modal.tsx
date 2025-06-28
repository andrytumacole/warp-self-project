import useRemoveWorkspace from "@/app/api/use-delete-workspace";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteWorkspaceConfirmModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspaceName: string;
  workspaceId: Id<"workspaces">;
}

function DeleteWorkspaceConfirmModal(
  props: Readonly<DeleteWorkspaceConfirmModalProp>
) {
  const { isOpen, setIsOpen, workspaceName, workspaceId } = props;
  const router = useRouter();

  const {
    mutateAsync: remove,
    isPending: isRemovingWorkspace,
    error: deleteError,
  } = useRemoveWorkspace({
    onSuccess: handleDeleteSuccess,
    onError: handleDeleteError,
    onSettled: handleDeleteSettled,
  });

  function handleDeleteSuccess() {
    router.replace("/");
    console.log("successfully deleted workspace");
    toast("Successfully deleted workspace!", {
      description: workspaceName,
    });
  }

  function handleDeleteError() {
    console.log("Something went wrong in deleting the workspace");
    console.log("error: " + deleteError);
  }

  function handleDeleteSettled() {
    console.log("Finished deleting!");
    setIsOpen(false);
  }

  async function handleDelete() {
    await remove({ id: workspaceId });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600 outline-none"
        asChild
      >
        <div>
          <TrashIcon className="size-4" />
          <p className="text-sm font-semibold">Delete workspace</p>
        </div>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Delete this workspace</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to do this?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            disabled={isRemovingWorkspace}
            variant={"destructive"}
            onClick={handleDelete}
            className="focus-visible:outline-none"
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button disabled={isRemovingWorkspace}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteWorkspaceConfirmModal;
