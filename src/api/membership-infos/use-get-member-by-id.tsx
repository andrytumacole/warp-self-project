import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetMemberByIdProps {
  id: Id<"membershipInfos">;
}

function useGetMemberById(props: Readonly<UseGetMemberByIdProps>) {
  const { id } = props;
  const membershipInfo = useQuery(api.membership_info.getById, {
    memberId: id,
  });
  const isLoading = membershipInfo === undefined;
  return { membershipInfo, isLoading };
}

export default useGetMemberById;
