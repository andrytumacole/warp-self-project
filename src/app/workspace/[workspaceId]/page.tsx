"use client";

import useGetWorkspaceById from "@/app/api/use-get-workspace-by-id";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";

function WorkspaceIdPage() {
  const workspaceId = useGetWorkspaceId();
  const { workspace } = useGetWorkspaceById({ id: workspaceId });
  return (
    <div className="w-full h-full flex justify-center items-center p-40 flex-col">
      <p>ID: {workspaceId}</p>
      <div className="w-1/2">
        <p className="text-wrap break-words">
          Data: {JSON.stringify(workspace)}
        </p>
      </div>
    </div>
  );
}

export default WorkspaceIdPage;
