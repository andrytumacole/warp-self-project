import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetCurrentMemberProps {
  workspaceId: Id<"workspaces">;
}

function useGetCurrentMember(props: Readonly<UseGetCurrentMemberProps>) {
  const { workspaceId } = props;
  const membershipInfo = useQuery(api.members.current, {
    workspaceId: workspaceId,
  });
  const isLoading = membershipInfo === undefined;
  return { membershipInfo, isLoading };
}

export default useGetCurrentMember;
