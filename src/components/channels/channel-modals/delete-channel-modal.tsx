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

interface DeleteChannelModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  channelName: string;
  channelId: Id<"channels">;
}

function DeleteChannelModal(props: Readonly<DeleteChannelModalProp>) {
  const { isOpen, setIsOpen, channelName, channelId } = props;
  const workspaceId = useGetWorkspaceId();

  const router = useRouter();

  function handleDeleteSuccess() {
    router.replace(`/workspace/${workspaceId}`);
    console.log("successfully deleted workspace");
    toast("Successfully deleted workspace!", {
      description: channelName,
    });
  }

  function handleDeleteError() {
    console.log("Something went wrong in deleting the workspace");
    // console.log("error: " + deleteError);
  }

  function handleDeleteSettled() {
    console.log("Finished deleting!");
    setIsOpen(false);
  }

  async function handleDelete() {
    // await remove({ id: workspaceId });
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
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteChannelModal;
