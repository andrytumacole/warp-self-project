import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetMembersByWorkspaceIdProps {
  workspaceId: Id<"workspaces">;
}

function useGetMembersByWorkspaceId(
  props: Readonly<UseGetMembersByWorkspaceIdProps>
) {
  const { workspaceId } = props;
  const members = useQuery(api.membership_info.get, {
    workspaceId: workspaceId,
  });
  const isLoading = members === undefined;
  return { members, isLoading };
}

export default useGetMembersByWorkspaceId;
