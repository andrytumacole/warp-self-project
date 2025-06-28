import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetCurrentMemberProps {
  workspaceId: Id<"workspaces">;
}

function useGetCurrentMembershipInfo(
  props: Readonly<UseGetCurrentMemberProps>
) {
  const { workspaceId } = props;
  const membershipInfo = useQuery(api.membership_info.current, {
    workspaceId: workspaceId,
  });
  const isLoading = membershipInfo === undefined;
  return { membershipInfo, isLoading };
}

export default useGetCurrentMembershipInfo;
