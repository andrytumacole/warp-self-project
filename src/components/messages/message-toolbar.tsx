import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "../ui/button";
import Hint from "../global/tooltip";
import EmojiPopover from "../input/emoji-popover";

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

function MessageToolbar(props: Readonly<MessageToolbarProps>) {
  const {
    isAuthor,
    isPending,
    handleEdit,
    handleDelete,
    handleReaction,
    handleThread,
    hideThreadButton,
  } = props;
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
            <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
              <MessageSquareTextIcon />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
                <Pencil />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
                <Trash className="text-rose-600" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
}

export default MessageToolbar;
