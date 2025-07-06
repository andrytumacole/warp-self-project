import { useRemoveMember } from "@/api/membership-infos/use-remove-member";

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
import { Button } from "../ui/button";
import { Id } from "../../../convex/_generated/dataModel";
import { usePanel } from "@/hooks/use-panel";

type RemoveType = "Leave" | "Remove";

interface ConfirmRemoveUserModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  membershipInfoId: Id<"membershipInfos">;
  type: RemoveType;
}

function ConfirmRemoveUserModal(props: Readonly<ConfirmRemoveUserModalProp>) {
  const { profileMemberId, onClose } = usePanel();
  const { isOpen, setIsOpen, membershipInfoId, type } = props;

  const {
    data: _removedMemberId,
    error: removeMemberError,
    isPending: isRemovingMember,
    mutateAsync: removeMember,
  } = useRemoveMember({
    onError: handleRemoveError,
    onSettled: handleRemoveSettled,
    onSuccess: handleRemoveSuccess,
  });

  function handleRemoveSuccess() {
    toast("Member successfully removed from workspace");
    if (profileMemberId === membershipInfoId) {
      onClose();
    }
  }

  function handleRemoveError() {
    toast.error(
      "Something went wrong in removing the member from the workspace",
      {
        description: removeMemberError?.message,
      }
    );
  }

  function handleRemoveSettled() {
    setIsOpen(false);
  }

  async function handleRemove() {
    await removeMember({ id: membershipInfoId });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full"
          disabled={isRemovingMember}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>
            {type === "Leave"
              ? "Leave the workspace"
              : "Remove the member from the workspace"}
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to do this?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={handleRemove}
            className="focus-visible:outline-none"
            disabled={isRemovingMember}
          >
            {type}
          </Button>
          <DialogClose asChild>
            <Button disabled={isRemovingMember}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ConfirmRemoveUserModal;
