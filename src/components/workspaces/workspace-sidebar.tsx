import useGetCurrentMember from "@/app/api/use-get-current-membership-info";
import useGetWorkspaceById from "@/app/api/use-get-workspace-by-id";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";

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

  return <div className="flex flex-col h-full">Add header here</div>;
}

export default WorkspaceSidebar;
