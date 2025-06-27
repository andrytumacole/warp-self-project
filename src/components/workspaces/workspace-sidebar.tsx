import useGetCurrentMember from "@/app/api/use-get-current-membership-info";
import useGetWorkspaceById from "@/app/api/use-get-workspace-by-id";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import { AlertTriangle, Loader, MessageSquareText } from "lucide-react";
import WorkspaceHeader from "./workspace-header";
import WorkspaceSidebarItem from "./workspace-sidebar-item";

function WorkspaceSidebar() {
  const workspaceId = useGetWorkspaceId();
  const { membershipInfo, isLoading: isFetchingMembershipInfo } =
    useGetCurrentMember({ workspaceId: workspaceId });
  const { workspace, isLoading: isFetchingWorkspace } = useGetWorkspaceById({
    id: workspaceId,
  });

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
      <div className="flex flex-col px-2 mt-3">
        <WorkspaceSidebarItem
          label="threads"
          icon={MessageSquareText}
          id="threads"
        />
      </div>
    </div>
  );
}

export default WorkspaceSidebar;
