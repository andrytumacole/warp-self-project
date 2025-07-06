import { useUpdateMemberRole } from "@/api/membership-infos/use-update-member-role";

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

interface ConfirmRemoveUserModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  membershipInfoId: Id<"membershipInfos">;
  role: "admin" | "member";
}

function ConfirmUpdateMemberRoleModal(
  props: Readonly<ConfirmRemoveUserModalProp>
) {
  const { isOpen, setIsOpen, membershipInfoId, role } = props;

  const {
    data: _memberId,
    error: updateRoleError,
    isPending: isUpdatingMemberRole,
    mutateAsync: updateMemberRole,
  } = useUpdateMemberRole({
    onError: handleUpdateError,
    onSettled: handleUpdateSettled,
    onSuccess: handleUpdateSuccess,
  });

  function handleUpdateSuccess() {
    toast("Workspace role successfully changed to " + role);
  }

  function handleUpdateError() {
    toast.error(
      "Something went wrong in updating the role of the member in the workspace",
      {
        description: updateRoleError?.message,
      }
    );
  }

  function handleUpdateSettled() {
    setIsOpen(false);
  }

  async function handleUpdateRole() {
    await updateMemberRole({ id: membershipInfoId, role: role });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full"
          disabled={isUpdatingMemberRole}
        >
          Change
        </Button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>
            Change the role of the member in the workspace
          </DialogTitle>
          <DialogDescription>
            It will change their privileges in the workspace. Are you sure you
            want to do this?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={handleUpdateRole}
            className="focus-visible:outline-none"
            disabled={isUpdatingMemberRole}
          >
            Change
          </Button>
          <DialogClose asChild>
            <Button disabled={isUpdatingMemberRole}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ConfirmUpdateMemberRoleModal;
