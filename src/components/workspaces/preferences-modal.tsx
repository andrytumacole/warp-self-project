import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import useRemoveWorkspace from "@/app/api/use-delete-workspace";
import EditWorkspaceModal from "./edit-workspace-modal";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
interface PreferencesModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialWorkspaceName: string;
}

function PreferencesModal(props: Readonly<PreferencesModalProp>) {
  const { isOpen, setIsOpen, initialWorkspaceName } = props;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(initialWorkspaceName);
  const workspaceId = useGetWorkspaceId();

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
    console.log("successfully deleted workspace");
    toast("Successfully deleted workspace!", {
      description: initialWorkspaceName,
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 bg-gray-100 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{workspaceName}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <EditWorkspaceModal
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            workspaceName={workspaceName}
            setWorkspaceName={setWorkspaceName}
            workspaceId={workspaceId}
          />
          <button
            onClick={() => {}}
            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600 outline-none"
          >
            <TrashIcon className="size-4" />
            <p className="text-sm font-semibold">Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreferencesModal;
