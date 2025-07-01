import dynamic from "next/dynamic";

import { Doc, Id } from "../../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { useUpdateMessage } from "@/api/messages/use-update-message";

import Hint from "../global/tooltip";
import Thumbnail from "./thumbnail";
import MessageToolbar from "./message-toolbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useToggleReaction } from "@/api/reactions/use-toggle-reaction";
import ReactionsBar from "./reactions-bar";
import { usePanel } from "@/hooks/use-panel";
import Threadbar from "./threadbar";

const MessageRenderer = dynamic(() => import("./message-renderer"), {
  ssr: false,
});
const Editor = dynamic(() => import("../input/editor"), {
  ssr: false,
});

interface MessageProps {
  messageId: Id<"messages">;
  membershipInfoId: Id<"membershipInfos">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  //remember that the reactions are modified inside the messages.get api
  //membershipInfoId is also removed (filtered) before the data was returned
  reactions: Array<
    Omit<Doc<"reactions">, "membershipInfoId"> & {
      count: number;
      membershipInfoIds: Id<"membershipInfos">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact: boolean | null;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
}

function Message(props: Readonly<MessageProps>) {
  const {
    messageId,
    isAuthor,
    membershipInfoId,
    authorImage,
    authorName = "Member",
    reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimestamp,
    threadName,
  } = props;

  const { onOpenMessage } = usePanel();
  const avatarFallbackContent = authorName.charAt(0).toUpperCase();

  const {
    mutateAsync: updateMessage,
    isPending: isUpdatingMessage,
    error: errorUpdate,
  } = useUpdateMessage({
    onSuccess: handleUpdateMessageSuccess,
    onError: handleUpdateMessageError,
    onSettled: handleUpdateMessageSettled,
  });

  const { mutateAsync: toggleReaction, isPending: _isTogglingReaction } =
    useToggleReaction({
      onError: handleToggleError,
    });

  const isMessagePending = isUpdatingMessage;

  function handleUpdateMessageSuccess() {
    toast("Message has been edited");
  }
  function handleUpdateMessageError() {
    toast.error("Something went wrong in editing your message", {
      description: errorUpdate?.message,
    });
  }
  function handleUpdateMessageSettled() {
    setEditingId(null);
  }

  function handleToggleError() {
    toast.error("Failed to toggle reaction");
  }

  async function handleUpdateMessage({ body }: { body: string }) {
    await updateMessage({
      body: body,
      id: messageId,
    });
  }

  async function handleToggleReaction(value: string) {
    await toggleReaction({ messageId: messageId, value: value });
  }

  function formatFullTime(date: Date) {
    const timeString = `at ${format(date, "h:mm a")}`;
    if (isToday(date)) {
      return `Today ${timeString}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${timeString}`;
    }

    return `${format(date, "MMM d, yyyy")} ${timeString}`;
  }

  //TODO: fix isCompact conditional rendering

  return isCompact ? (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-200/60 group relative",
        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
      )}
    >
      <div className="flex gap-2 items-center">
        <Hint label={formatFullTime(new Date(createdAt))}>
          <button className=" min-w-[40px] text-xs text-muted-foreground opacity-0 group-hover:opacity-100 leading-[22px] text-center hover:underline">
            {format(new Date(createdAt), "hh:mm")}
          </button>
        </Hint>
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdateMessage}
              disabled={isMessagePending}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant="update"
            />
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden">
            <MessageRenderer rawMessage={body} />
            <Thumbnail url={image} />
            {updatedAt && (
              <span className="text-xs text-muted-foreground">edited</span>
            )}
            <ReactionsBar data={reactions} onChange={handleToggleReaction} />
            <Threadbar
              count={threadCount}
              image={threadImage}
              timestamp={threadTimestamp}
              name={threadName}
              onClick={() => onOpenMessage(messageId)}
            />
          </div>
        )}
      </div>
      {!isEditing && (
        <MessageToolbar
          isAuthor={isAuthor}
          isPending={isMessagePending}
          handleEdit={() => setEditingId(messageId)}
          handleThread={() => onOpenMessage(messageId)}
          handleReaction={handleToggleReaction}
          hideThreadButton={hideThreadButton}
          messageId={messageId}
        />
      )}
    </div>
  ) : (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-200/60 group relative",
        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
      )}
    >
      <div className="flex gap-2 items-start">
        <button>
          <Avatar>
            <AvatarImage src={authorImage} alt={authorName} />
            <AvatarFallback className="text-white bg-sky-500 text-sm">
              {avatarFallbackContent}
            </AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdateMessage}
              disabled={isMessagePending}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant="update"
            />
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden ">
            <div className="flex text-sm gap-x-3">
              <button className="font-bold text-primary hover:underline">
                <p className="text-start">{authorName}</p>
              </button>
              <Hint label={formatFullTime(new Date(createdAt))}>
                <button className="text-xs text-muted-foreground hover:underline">
                  {format(new Date(createdAt), "h:mm a")}
                </button>
              </Hint>
            </div>
            <MessageRenderer rawMessage={body} />
            <Thumbnail url={image} />
            {updatedAt && (
              <span className="text-xs text-muted-foreground">edited</span>
            )}
            <ReactionsBar data={reactions} onChange={handleToggleReaction} />
            <Threadbar
              count={threadCount}
              image={threadImage}
              timestamp={threadTimestamp}
              name={threadName}
              onClick={() => onOpenMessage(messageId)}
            />
          </div>
        )}
      </div>
      {!isEditing && (
        <MessageToolbar
          isAuthor={isAuthor}
          isPending={isMessagePending}
          handleEdit={() => setEditingId(messageId)}
          handleThread={() => onOpenMessage(messageId)}
          handleReaction={handleToggleReaction}
          hideThreadButton={hideThreadButton}
          messageId={messageId}
        />
      )}
    </div>
  );
}

export default Message;
