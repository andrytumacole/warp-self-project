import useGetCurrentMember from "@/app/api/membership-infos/use-get-current-membership-info";
import useGetWorkspaceById from "@/app/api/workspaces/use-get-workspace-by-id";
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
import useGetChannelsByWorkspaceId from "@/app/api/channels/use-get-channels-by-workspace-id";
import WorkspaceSection from "./workspace-section";
import useGetMembersByWorkspaceId from "@/app/api/membership-infos/use-get-members-by-workspace-id";
import WorkspaceSidebarUserItem from "./workspace-sidebar-user-item";
import { useCreateChannelModal } from "@/app/atom-states/use-create-channel-modal";

function WorkspaceSidebar() {
  const workspaceId = useGetWorkspaceId();
  const [_isCreateChannelModalOpen, setIsCreateChannelModalOpen] =
    useCreateChannelModal();
  const { membershipInfo, isLoading: isFetchingMembershipInfo } =
    useGetCurrentMember({ workspaceId: workspaceId });
  const { workspace, isLoading: isFetchingWorkspace } = useGetWorkspaceById({
    id: workspaceId,
  });

  const { channels, isLoading: _isFetchingChannels } =
    useGetChannelsByWorkspaceId({ workspaceId: workspaceId });

  const { members, isLoading: _isFetchingMembers } = useGetMembersByWorkspaceId(
    {
      workspaceId: workspaceId,
    }
  );

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
      </div>

      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={
          membershipInfo.role === "admin"
            ? () => setIsCreateChannelModalOpen(true)
            : undefined
        } //non admin members cannot add channel
      >
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
      </WorkspaceSection>

      <WorkspaceSection
        label="Direct messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {members?.map((memberItem) => {
          return (
            <WorkspaceSidebarUserItem
              key={memberItem._id}
              label={memberItem.user.name ?? "Anonymous"}
              image={memberItem.user.image}
              id={memberItem._id}
            />
          );
        })}
      </WorkspaceSection>
    </div>
  );
}

export default WorkspaceSidebar;
