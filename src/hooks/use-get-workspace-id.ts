import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

function useGetWorkspaceId() {
  const params = useParams();
  return params.workspaceId as Id<"workspaces">;
}

export default useGetWorkspaceId;
