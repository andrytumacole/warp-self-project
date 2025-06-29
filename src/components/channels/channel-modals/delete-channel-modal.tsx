import useGetWorkspaceId from "@/hooks/use-get-workspace-id";

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
import { useRemoveChannel } from "@/api/channels/use-delete-channel";

interface DeleteChannelModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  channelName: string;
  channelId: Id<"channels">;
}

function DeleteChannelModal(props: Readonly<DeleteChannelModalProp>) {
  const { isOpen, setIsOpen, channelName, channelId } = props;
  const workspaceId = useGetWorkspaceId();
  const {
    mutateAsync: remove,
    isPending: isRemovingChannel,
    error: deleteError,
  } = useRemoveChannel({
    onSuccess: handleDeleteSuccess,
    onError: handleDeleteError,
    onSettled: handleDeleteSettled,
  });

  const router = useRouter();

  function handleDeleteSuccess() {
    router.replace(`/workspace/${workspaceId}/`);
    toast("Successfully deleted channel!", {
      description: channelName,
    });
  }

  function handleDeleteError() {
    toast.error("Something went wrong in deleting the channel", {
      description: deleteError?.message,
    });
  }

  function handleDeleteSettled() {
    console.log("Finished deleting!");
    setIsOpen(false);
  }

  async function handleDelete() {
    await remove({ channelId: channelId });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
        asChild
      >
        <div>
          <TrashIcon className="size-4 " />
          <p className="text-sm font-semibold">Delete channel</p>
        </div>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Delete this channel</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to do this?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={handleDelete}
            className="focus-visible:outline-none"
            disabled={isRemovingChannel}
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button disabled={isRemovingChannel}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteChannelModal;
