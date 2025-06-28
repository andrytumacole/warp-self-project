import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { CopyIcon } from "lucide-react";

interface PreferencesModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspaceName: string;
  joinCode: string;
  workspaceId: string;
}

function InviteToWorkspaceModal(props: Readonly<PreferencesModalProp>) {
  const { isOpen, setIsOpen, workspaceName, joinCode, workspaceId } = props;
  async function handleCopy() {
    //origin means the domain where the app will be hosted
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    await navigator.clipboard.writeText(inviteLink);
    toast("Invite link copied to clipboard");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 bg-gray-100 overflow-hidden [&>button]:hidden focus-visible:outline-none">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{workspaceName}</DialogTitle>
          <DialogDescription>
            Invite people to this workspace by using the code below
          </DialogDescription>
        </DialogHeader>
        <div className="py-7 flex flex-col justify-center items-center gap-y-4">
          <p className="text-4xl font-bold tracking-widest uppercase">
            {joinCode}
          </p>
          <Button variant={"ghost"} size="sm" onClick={handleCopy}>
            Copy link
            <CopyIcon className="size-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteToWorkspaceModal;
