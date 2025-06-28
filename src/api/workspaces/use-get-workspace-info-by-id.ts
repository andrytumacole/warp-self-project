import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetWorkspaceInfoByIdProps {
  id: Id<"workspaces">;
}

function useGetWorkspaceInfoById(props: UseGetWorkspaceInfoByIdProps) {
  const { id } = props;
  const data = useQuery(api.workspaces.getInfoById, { id: id });
  const isLoading = data === undefined;
  return { data, isLoading };
}

export default useGetWorkspaceInfoById;
