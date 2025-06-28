import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceByIdProps {
  id: Id<"workspaces">;
}

function useGetWorkspaceById(props: UseGetWorkspaceByIdProps) {
  const { id } = props;
  const workspace = useQuery(api.workspaces.getById, { id: id });
  const isLoading = workspace === undefined;
  return { workspace, isLoading };
}

export default useGetWorkspaceById;
