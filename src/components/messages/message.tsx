import dynamic from "next/dynamic";

import { Doc, Id } from "../../../convex/_generated/dataModel";

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
  isCompact?: boolean;
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
  return (
    <div>
      <MessageRenderer rawMessage={body} />
    </div>
  );
}

export default Message;
