import { MessageSquareTextIcon, Pencil, Smile } from "lucide-react";
import { Button } from "../ui/button";
import Hint from "../global/tooltip";
import EmojiPopover from "../input/emoji-popover";
import { useState } from "react";
import ConfirmDeleteMessageModal from "./confirm-delete-message-modal";
import { Id } from "../../../convex/_generated/dataModel";

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
  messageId: Id<"messages">;
}

function MessageToolbar(props: Readonly<MessageToolbarProps>) {
  const {
    isAuthor,
    isPending,
    handleEdit,
    handleReaction,
    handleThread,
    hideThreadButton,
    messageId,
  } = props;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-sm shadow-sm">
        <EmojiPopover
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
          hint="Add reaction"
        >
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <Smile />
          </Button>
        </EmojiPopover>

        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareTextIcon />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                variant={"ghost"}
                size={"iconSm"}
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <ConfirmDeleteMessageModal
                isOpen={isDeleteOpen}
                messageId={messageId}
                setIsOpen={setIsDeleteOpen}
                isPending={isPending}
              />
            </Hint>
          </>
        )}
      </div>
    </div>
  );
}

export default MessageToolbar;
