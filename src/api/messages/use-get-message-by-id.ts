import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetChannelByIdProp {
  messageId: Id<"messages">;
}

function useGetMessageById(props: Readonly<UseGetChannelByIdProp>) {
  const { messageId } = props;
  const message = useQuery(api.messages.getById, {
    messageId: messageId,
  });
  const isLoading = message === undefined;
  return { message, isLoading };
}

export default useGetMessageById;
