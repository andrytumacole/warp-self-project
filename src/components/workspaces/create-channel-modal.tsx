import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormEvent, useState } from "react";
import { useCreateChannelModal } from "@/app/atom-states/use-create-channel-modal";
import { useRouter } from "next/navigation";
import { useCreateChannel } from "@/app/api/use-create-channel";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";

function CreateChannelModal() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useCreateChannelModal();
  const [channelInfo, setChannelInfo] = useState("");
  const { isPending, error, mutateAsync } = useCreateChannel({
    onSuccess: handleSuccess,
    onError: handleError,
    onSettled: handleSettled,
  });
  const workspaceId = useGetWorkspaceId();

  function handleClose() {
    setIsModalOpen(false);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const channelId = await mutateAsync({
      name: channelInfo,
      workspaceId: workspaceId,
    });
    console.log(channelId);
    router.replace(`/workspace/${workspaceId}`);
  }

  function handleSuccess() {
    console.log("successfully created workspace");
    toast("Successfully created workspace!", {
      description: channelInfo,
    });
  }

  function handleError() {
    console.log("Something went wrong in creating the workspace");
    console.log("error: " + error);
  }

  function handleSettled() {
    console.log("Finished! You can now proceed");
    setIsModalOpen(false);
    setChannelInfo("");
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-lg [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-2.5" onSubmit={handleCreate}>
          <Input
            value={channelInfo}
            required
            autoFocus
            minLength={3}
            disabled={isPending}
            onChange={(e) => setChannelInfo(e.target.value)}
            placeholder={`Workspace name e.g. "Work", "Personal", "Home"`}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default CreateChannelModal;
