"use client";

import { useCreateOrGetConversation } from "@/api/conversations/use-create-or-get-conversation";
import useGetMemberId from "@/hooks/use-get-member-id";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import Conversation from "@/components/conversations/conversation";

function MemberIdPage() {
  const [data, setData] = useState<Id<"conversations"> | null | undefined>(
    null
  );
  const workspaceId = useGetWorkspaceId();
  const memberId = useGetMemberId();
  const {
    data: conversationId,
    mutateAsync: createOrGet,
    isPending,
    error: conversationError,
  } = useCreateOrGetConversation({
    onError: handleError,
  });

  function handleError() {
    toast.error("Something went wrong in loading the conversation");
    console.log(conversationError);
  }

  const handleFetch = useCallback(async () => {
    const conversationId = await createOrGet({
      workspaceId,
      memberId,
    });
    setData(conversationId);
  }, [createOrGet, setData, workspaceId, memberId]);

  useEffect(() => {
    handleFetch();
  }, [memberId, workspaceId, handleFetch]);

  if (isPending) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading conversation</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-2">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return <Conversation id={data} />;
}

export default MemberIdPage;
