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
import { ChangeEvent, FormEvent, useState } from "react";
import { useCreateChannelModal } from "@/store/use-create-channel-modal";
import { useRouter } from "next/navigation";
import { useCreateChannel } from "@/api/channels/use-create-channel";
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
    setChannelInfo("");
    setIsModalOpen(false);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const channelId = await mutateAsync({
      name: channelInfo,
      workspaceId: workspaceId,
    });
    console.log(channelId);
    router.replace(`/workspace/${workspaceId}/channel/${channelId}`);
  }

  function handleSuccess() {
    console.log("successfully created channel");
    toast("Successfully created channel!", {
      description: channelInfo,
    });
  }

  function handleError() {
    console.log("Something went wrong in creating the channel");
    console.log("error: " + error);
    toast.error("Something went wrong in creating the channel");
  }

  function handleSettled() {
    console.log("Finished! You can now proceed");
    setIsModalOpen(false);
    setChannelInfo("");
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const parsedValue = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setChannelInfo(parsedValue);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-lg [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
          <DialogDescription>{`Note: whitespace is not allowed and will be autoreplaced with "-"`}</DialogDescription>
        </DialogHeader>
        <form className="space-y-2.5" onSubmit={handleCreate}>
          <Input
            value={channelInfo}
            required
            autoFocus
            minLength={3}
            disabled={isPending}
            onChange={handleInputChange}
            placeholder={`Channel name e.g. "new-channel", "admin", "welcome"`}
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
