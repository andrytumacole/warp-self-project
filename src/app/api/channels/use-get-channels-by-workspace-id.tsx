import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetChannelsByWorkspaceIdProp {
  workspaceId: Id<"workspaces">;
}

function useGetChannelsByWorkspaceId(
  props: Readonly<UseGetChannelsByWorkspaceIdProp>
) {
  const { workspaceId } = props;
  const channels = useQuery(api.channels.get, { workspaceId: workspaceId });
  const isLoading = channels === undefined;
  return { channels, isLoading };
}

export default useGetChannelsByWorkspaceId;
