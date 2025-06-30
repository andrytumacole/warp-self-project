import { useParentMessageId } from "@/store/use-parent-message-id";

export const usePanel = () => {
  //based on the query, it gets the parentMessageId on the url params
  const [parentMessageId, setParentMessageId] = useParentMessageId();

  const onOpenMessage = (messageId: string) => {
    //sets the parentMessageId params in the url to whatever the messageId passed
    setParentMessageId(messageId);
  };

  const onClose = () => {
    setParentMessageId(null);
  };

  return { parentMessageId, onOpenMessage, onClose };
};
