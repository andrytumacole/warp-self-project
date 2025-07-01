"use client";

import useGetMemberId from "@/hooks/use-get-member-id";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";

function MemberIdPage() {
  const workspaceId = useGetWorkspaceId();
  const memberId = useGetMemberId();
  return <div>Member ID test page</div>;
}

export default MemberIdPage;
