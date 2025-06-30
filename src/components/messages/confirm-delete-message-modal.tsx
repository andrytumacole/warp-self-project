import { useDeleteMessage } from "@/api/messages/use-delete-message";

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
import { Trash, TrashIcon } from "lucide-react";

interface DeleteChannelModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  messageId: Id<"messages">;
  isPending: boolean;
}

function ConfirmDeleteMessageModal(props: Readonly<DeleteChannelModalProp>) {
  const { isOpen, setIsOpen, messageId, isPending } = props;

  const {
    mutateAsync: deleteMessage,
    isPending: isDeletingMessage,
    error: errorDelete,
  } = useDeleteMessage({
    onSuccess: handleDeleteSuccess,
    onError: handleDeleteError,
    onSettled: handleDeleteSettled,
  });

  function handleDeleteSuccess() {
    toast("Message successfully deleted");
  }

  function handleDeleteError() {
    toast.error("Something went wrong in deleting your message", {
      description: errorDelete?.message,
    });
  }

  function handleDeleteSettled() {
    setIsOpen(false);
  }

  async function handleDelete() {
    await deleteMessage({ id: messageId });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"iconSm"}
          disabled={isPending || isDeletingMessage}
        >
          <Trash className="text-rose-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Delete this message</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to do this?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={handleDelete}
            className="focus-visible:outline-none"
            disabled={isPending || isDeletingMessage}
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button disabled={isPending || isDeletingMessage}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ConfirmDeleteMessageModal;
