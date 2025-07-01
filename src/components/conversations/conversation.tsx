import { Id } from "../../../convex/_generated/dataModel";

import useGetMemberById from "@/api/membership-infos/use-get-member-by-id";
import useGetMemberId from "@/hooks/use-get-member-id";
import useGetMessages from "@/api/messages/use-get-message";

import { Loader } from "lucide-react";
import ConversationHeader from "./conversation-header";

interface ConversationProps {
  id: Id<"conversations">;
}

function Conversation(props: Readonly<ConversationProps>) {
  const { id } = props;
  const memberId = useGetMemberId();
  const { membershipInfo, isLoading: isFetchingMember } = useGetMemberById({
    id: memberId,
  });

  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (isFetchingMember || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading messages</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        memberName={membershipInfo?.user.name}
        memberImage={membershipInfo?.user.image}
      />
    </div>
  );
}

export default Conversation;
