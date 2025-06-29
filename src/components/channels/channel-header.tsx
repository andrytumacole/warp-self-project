import { useState } from "react";
import useGetChannelId from "@/hooks/use-get-channel-id";

import { FaCog } from "react-icons/fa";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditChannelModal from "./channel-modals/edit-channel-modal";
import DeleteChannelModal from "./channel-modals/delete-channel-modal";
import useGetCurrentMembershipInfo from "@/api/membership-infos/use-get-current-membership-info";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";

interface ChannelHeaderProps {
  initialChannelName: string;
}

function ChannelHeader(props: Readonly<ChannelHeaderProps>) {
  const { initialChannelName } = props;
  const channelId = useGetChannelId();
  const workspaceId = useGetWorkspaceId();
  const { membershipInfo, isLoading: _isFetchingMembershipInfo } =
    useGetCurrentMembershipInfo({
      workspaceId: workspaceId,
    });
  const [channelName, setChannelName] = useState(initialChannelName);
  const [isEditChannelModalOpen, setIsEditChannelModalOpen] = useState(false);
  const [isDeleteChannelModalOpen, setIsDeleteChannelModalOpen] =
    useState(false);

  return (
    <div className="flex items-center justify-between px-4 bg-white border-b h-[49px] overflow-hidden">
      <div className="text-lg font-semibold px-2 overflow-hidden w-auto">
        <span className="truncate"># {channelName}</span>
      </div>
      {membershipInfo?.role === "admin" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"ghost"}
              className="text-lg font-semibold p-4 overflow-hidden w-auto"
              size={"lg"}
            >
              <FaCog className="text-slate-800" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden [&>button]:hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {channelName}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <EditChannelModal
                isOpen={isEditChannelModalOpen}
                setIsOpen={setIsEditChannelModalOpen}
                channelId={channelId}
                initialChannelName={initialChannelName}
                setChannelName={setChannelName}
              />
              <DeleteChannelModal
                isOpen={isDeleteChannelModalOpen}
                setIsOpen={setIsDeleteChannelModalOpen}
                channelId={channelId}
                channelName={channelName}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ChannelHeader;
