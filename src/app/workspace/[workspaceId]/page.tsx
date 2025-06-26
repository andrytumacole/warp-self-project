"use client";

import useGetWorkspaceId from "@/hooks/use-get-workspace-id";

function WorkspaceIdPage() {
  const workspaceId = useGetWorkspaceId();
  return (
    <div className="w-full h-full flex justify-center items-center">
      ID: {workspaceId}
    </div>
  );
}

export default WorkspaceIdPage;
