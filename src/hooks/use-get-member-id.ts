import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

function useGetMemberId() {
  const params = useParams();
  return params.memberId as Id<"membershipInfos">;
}

export default useGetMemberId;
