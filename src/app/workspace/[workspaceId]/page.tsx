"use client";

import useGetChannelsByWorkspaceId from "@/api/channels/use-get-channels-by-workspace-id";
import { useCreateChannelModal } from "@/atom-states/use-create-channel-modal";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

function WorkspaceIdPage() {
  const router = useRouter();
  const workspaceId = useGetWorkspaceId();
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] =
    useCreateChannelModal();

  const { channels, isLoading: isFetchingChannels } =
    useGetChannelsByWorkspaceId({ workspaceId: workspaceId });

  const firstChannelId = useMemo(() => {
    return channels?.[0]?._id;
  }, [channels]);

  useEffect(() => {
    if (isFetchingChannels) return;

    if (firstChannelId) {
      router.push(`/workspace/${workspaceId}/channel/${firstChannelId}`);
    } else if (!isCreateChannelModalOpen) {
      setIsCreateChannelModalOpen(true);
    }
  }, [
    firstChannelId,
    isFetchingChannels,
    isCreateChannelModalOpen,
    setIsCreateChannelModalOpen,
    router,
    workspaceId,
  ]);

  return (
    <div className="h-full flex items-center justify-center flex-col gap-2">
      <Loader className="animate-spin size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {isFetchingChannels
          ? "Fetching channels from database"
          : "Redirecting to channel"}
      </span>
    </div>
  );
}

export default WorkspaceIdPage;
