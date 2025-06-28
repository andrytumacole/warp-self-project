import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetChannelsByWorkspaceIdProp {
  workspaceId: Id<"workspaces">;
}

function useGetChannelsByWorkspaceId(
  props: Readonly<UseGetChannelsByWorkspaceIdProp>
) {
  const { workspaceId } = props;
  const members = useQuery(api.membership_info.get, {
    workspaceId: workspaceId,
  });
  const isLoading = members === undefined;
  return { members, isLoading };
}

export default useGetChannelsByWorkspaceId;
