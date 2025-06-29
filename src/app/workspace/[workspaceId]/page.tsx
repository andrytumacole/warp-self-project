"use client";

import useGetChannelsByWorkspaceId from "@/api/channels/use-get-channels-by-workspace-id";
import { useCreateChannelModal } from "@/atom-states/use-create-channel-modal";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import useGetCurrentMembershipInfo from "@/api/membership-infos/use-get-current-membership-info";

import { Loader, TriangleAlert } from "lucide-react";
import useGetWorkspaceById from "@/api/workspaces/use-get-workspace-by-id";

function WorkspaceIdPage() {
  const router = useRouter();
  const workspaceId = useGetWorkspaceId();
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] =
    useCreateChannelModal();

  const { channels, isLoading: isFetchingChannels } =
    useGetChannelsByWorkspaceId({ workspaceId: workspaceId });

  const {
    membershipInfo: userMembershipInfo,
    isLoading: isFetchingMembershipInfo,
  } = useGetCurrentMembershipInfo({ workspaceId: workspaceId });

  const { workspace, isLoading: isFetchingWorkspace } = useGetWorkspaceById({
    id: workspaceId,
  });

  const firstChannelId = useMemo(() => {
    return channels?.[0]?._id;
  }, [channels]);

  const isAdmin = useMemo(() => {
    return userMembershipInfo?.role === "admin";
  }, [userMembershipInfo?.role]);

  useEffect(() => {
    if (isFetchingChannels || isFetchingMembershipInfo || isFetchingWorkspace)
      return;

    if (firstChannelId) {
      router.push(`/workspace/${workspaceId}/channel/${firstChannelId}`);
    } else if (!isCreateChannelModalOpen && isAdmin) {
      setIsCreateChannelModalOpen(true);
    }
  }, [
    firstChannelId,
    isFetchingChannels,
    isCreateChannelModalOpen,
    setIsCreateChannelModalOpen,
    router,
    workspaceId,
    isFetchingMembershipInfo,
    isAdmin,
    isFetchingWorkspace,
  ]);

  if (!workspace || !userMembershipInfo) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-2">
        {isFetchingWorkspace || isFetchingMembershipInfo ? (
          <>
            <Loader className="animate-spin size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Fetching workspace from the database
            </span>
          </>
        ) : (
          <>
            <TriangleAlert />
            <span className="text-sm text-muted-foreground">
              Workspace not found
            </span>
          </>
        )}
      </div>
    );
  }

  return !isAdmin ? (
    <div className="h-full flex items-center justify-center flex-col gap-2">
      <TriangleAlert />
      <span className="text-sm text-muted-foreground">
        There are no channels here
      </span>
    </div>
  ) : (
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
