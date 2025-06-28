import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

interface PreferencesModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspaceName: string;
}

function InviteToWorkspaceModal(props: Readonly<PreferencesModalProp>) {
  const { isOpen, setIsOpen, workspaceName } = props;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 bg-gray-100 overflow-hidden [&>button]:hidden focus-visible:outline-none">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{workspaceName}</DialogTitle>
          <DialogDescription>Invite people to this workspace</DialogDescription>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <p>something here</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteToWorkspaceModal;
