"use client";

import useGetWorkspaceById from "@/api/workspaces/use-get-workspace-by-id";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";

function WorkspaceIdPage() {
  const workspaceId = useGetWorkspaceId();
  const { workspace: _workspace } = useGetWorkspaceById({ id: workspaceId });
  return <div></div>;
}

export default WorkspaceIdPage;
