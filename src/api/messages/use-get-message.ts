import { usePaginatedQuery } from "convex/react";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

//size of messages to load per page
const BATCH_SIZE = 20;

interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}

export type GetMessagesReturnType = typeof api.messages.get._returnType;

function useGetMessages(props: Readonly<UseGetMessagesProps>) {
  const { channelId, conversationId, parentMessageId } = props;
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    {
      channelId,
      conversationId,
      parentMessageId,
    },
    { initialNumItems: BATCH_SIZE }
  );

  return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
}

export default useGetMessages;
