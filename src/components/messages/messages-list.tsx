import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { GetMessagesReturnType } from "@/api/messages/use-get-message";
import Message from "./message";

const MINUTE_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType["page"] | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

function MessageList(props: Readonly<MessageListProps>) {
  const {
    memberName,
    memberImage,
    channelName,
    channelCreationTime,
    variant,
    canLoadMore,
    data,
    loadMore,
    isLoadingMore,
  } = props;

  const groupedMessagesByDate = data?.reduce(
    (groups, message) => {
      const date = new Date(message!._creationTime);
      //key for grouping
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );

  function formatDateLabel(dateString: string) {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
  }

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessagesByDate || {}).map(
        ([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-[#f5f5f5] px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user?._id === message!.user?._id &&
                differenceInMinutes(
                  new Date(message!._creationTime),
                  new Date(prevMessage._creationTime)
                ) < MINUTE_THRESHOLD;

              return (
                <Message
                  key={message?._id}
                  id={message!._id}
                  membershipInfoId={message!.membershipInfoId}
                  authorName={message!.user.name}
                  authorImage={message!.user.image}
                  isAuthor={false}
                  reactions={message!.reactions}
                  body={message!.body}
                  image={message!.image}
                  updatedAt={message!.updatedAt}
                  createdAt={message!._creationTime}
                  isEditing={false}
                  setEditingId={() => {}}
                  isCompact={isCompact}
                  hideThreadButton={false}
                  threadCount={message!.threadCount}
                  threadImage={message!.threadImage}
                  threadTimestamp={message!.threadTimestamp}
                />
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

export default MessageList;
