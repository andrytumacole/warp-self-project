import dynamic from "next/dynamic";

import { Doc, Id } from "../../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";

import Hint from "../global/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Thumbnail from "./thumbnail";
import MessageToolbar from "./message-toolbar";

const MessageRenderer = dynamic(() => import("./message-renderer"), {
  ssr: false,
});

interface MessageProps {
  id: Id<"messages">;
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
}

function Message(props: Readonly<MessageProps>) {
  const {
    id,
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
  } = props;

  const avatarFallbackContent = authorName.charAt(0).toUpperCase();

  function formatFullTime(date: Date) {
    const timeString = `at ${format(date, "h:mm a")}`;
    if (isToday(date)) {
      return `Today ${timeString}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${timeString}`;
    }

    return `${format(date, "MMM d, yyyy")} ${timeString}`;
  }

  return isCompact ? (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-200/60 group relative">
      <div className="flex gap-2 items-center">
        <Hint label={formatFullTime(new Date(createdAt))}>
          <button className=" w-[45px] text-xs text-muted-foreground opacity-0 group-hover:opacity-100 leading-[22px] text-center hover:underline">
            {format(new Date(createdAt), "hh:mm")}
          </button>
        </Hint>
        <div className="flex flex-col w-full  ">
          <MessageRenderer rawMessage={body} />
          <Thumbnail url={image} />
          {updatedAt && (
            <span className="text-xs text-muted-foreground">edited</span>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-200/60 group relative">
      <div className="flex gap-2 items-center">
        <button>
          <Avatar>
            <AvatarImage src={authorImage} alt={authorName} />
            <AvatarFallback className="text-white bg-sky-500 text-sm">
              {avatarFallbackContent}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden ">
          <div className="flex text-sm gap-x-3">
            <button
              onClick={() => {}}
              className="font-bold text-primary hover:underline"
            >
              {authorName}
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
        </div>
      </div>
      {!isEditing && (
        <MessageToolbar
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={() => setEditingId(id)}
          handleThread={() => {}}
          handleDelete={() => {}}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
}

export default Message;
