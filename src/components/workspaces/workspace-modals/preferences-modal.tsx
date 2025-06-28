import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditWorkspaceModal from "./edit-workspace-modal";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import DeleteWorkspaceConfirmModal from "./delete-workspace-confirm-modal";
interface PreferencesModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialWorkspaceName: string;
}

function PreferencesModal(props: Readonly<PreferencesModalProp>) {
  const { isOpen, setIsOpen, initialWorkspaceName } = props;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [workspaceName, setWorkspaceName] = useState(initialWorkspaceName);
  const workspaceId = useGetWorkspaceId();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 bg-gray-100 overflow-hidden [&>button]:hidden focus-visible:outline-none">
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
          <DeleteWorkspaceConfirmModal
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
            workspaceId={workspaceId}
            workspaceName={workspaceName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreferencesModal;
