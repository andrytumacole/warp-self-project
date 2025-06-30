import useGetCurrentMembershipInfo from "@/api/membership-infos/use-get-current-membership-info";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import { useState } from "react";

import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import useGetMessageById from "@/api/messages/use-get-message-by-id";
import Message from "../messages/message";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

function Thread(props: Readonly<ThreadProps>) {
  const { messageId, onClose } = props;

  const { message, isLoading: isFetchingMessage } = useGetMessageById({
    messageId: messageId,
  });

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useGetWorkspaceId();
  const { membershipInfo: userMembershipInfo, isLoading: _ } =
    useGetCurrentMembershipInfo({ workspaceId: workspaceId });

  if (isFetchingMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col h-full items-center justify-center gap-y-2 overflow-hidden">
          <Loader className="size-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-center text-muted-foreground">
            Fetching thread messages...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      {message ? (
        <Message
          hideThreadButton
          membershipInfoId={message.membershipInfoId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.membershipInfoId === userMembershipInfo?._id}
          body={message.body}
          isCompact={false}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          messageId={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      ) : (
        <div className="flex flex-col h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground">
            No messages found
          </p>
        </div>
      )}
    </div>
  );
}
export default Thread;
