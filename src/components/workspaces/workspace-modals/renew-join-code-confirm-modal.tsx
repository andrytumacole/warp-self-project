import { useRenewNewJoinCode } from "@/api/workspaces/use-renew-join-code";

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
import { Id } from "../../../convex/_generated/dataModel";
import { RefreshCcw } from "lucide-react";

interface RenewJoinCodeConfirmModallProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspaceId: Id<"workspaces">;
}

function RenewJoinCodeConfirmModal(
  props: Readonly<RenewJoinCodeConfirmModallProp>
) {
  const { isOpen, setIsOpen, workspaceId } = props;

  const {
    data,
    isPending: isRenewing,
    error,
    mutateAsync,
  } = useRenewNewJoinCode({
    onSuccess: handleRenewSuccess,
    onError: handleRenewError,
    onSettled: handleRenewSettled,
  });

  function handleRenewSuccess() {
    toast("New code generated!", { description: data?.joinCode });
  }

  function handleRenewError() {
    console.log("Something went wrong in updating the workspace");
    console.log("error: " + error);
  }

  function handleRenewSettled() {
    console.log("Finished renewing join code!");
    setIsOpen(false);
  }

  async function handleRenew() {
    await mutateAsync({ workspaceId: workspaceId });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} disabled={isRenewing}>
          New code
          <RefreshCcw />
        </Button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Renew the join code</DialogTitle>
          <DialogDescription>
            This action will make the previous join codes obsolete. Are you sure
            you want to do this?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            disabled={isRenewing}
            onClick={handleRenew}
            variant={"outline"}
            className="focus-visible:outline-none"
          >
            Proceed
          </Button>
          <DialogClose asChild>
            <Button disabled={isRenewing}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default RenewJoinCodeConfirmModal;
