import useGetCurrentMember from "@/app/api/use-get-current-membership-info";
import useGetWorkspaceById from "@/app/api/use-get-workspace-by-id";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./workspace-header";
import WorkspaceSidebarItem from "./workspace-sidebar-item";
import useGetChannelsByWorkspaceId from "@/app/api/use-get-channels-by-workspace-id";

function WorkspaceSidebar() {
  const workspaceId = useGetWorkspaceId();
  const { membershipInfo, isLoading: isFetchingMembershipInfo } =
    useGetCurrentMember({ workspaceId: workspaceId });
  const { workspace, isLoading: isFetchingWorkspace } = useGetWorkspaceById({
    id: workspaceId,
  });

  const { channels, isLoading: isFetchingChannels } =
    useGetChannelsByWorkspaceId({ workspaceId: workspaceId });

  if (isFetchingMembershipInfo || isFetchingWorkspace) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }

  if (!workspace || !membershipInfo) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <AlertTriangle />
        <p className="text-center">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={membershipInfo.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3 space-y-1">
        <WorkspaceSidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
          variant={"active"}
        />
        <WorkspaceSidebarItem
          label="Drafts & Sent"
          icon={SendHorizonal}
          id="drafts"
        />
        {channels?.map((channelItem) => {
          return (
            <WorkspaceSidebarItem
              key={channelItem._id}
              label={channelItem.name}
              icon={HashIcon}
              id={channelItem._id}
            />
          );
        })}
      </div>
    </div>
  );
}

export default WorkspaceSidebar;
