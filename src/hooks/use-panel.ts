import { useParentMessageId } from "@/store/use-parent-message-id";
import { useProfileMemberId } from "@/store/use-profile-member-id";

export const usePanel = () => {
  //based on the query, it gets the parentMessageId on the url params
  const [parentMessageId, setParentMessageId] = useParentMessageId();

  //based on the query, it gets the profileMemberId on the url params
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOpenProfile = (userId: string) => {
    setParentMessageId(null);

    //sets the profileMemberId params in the url to whatever the userId passed
    setProfileMemberId(userId);
  };

  const onOpenMessage = (messageId: string) => {
    setProfileMemberId(null);

    //sets the parentMessageId params in the url to whatever the messageId passed
    setParentMessageId(messageId);
  };

  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onClose,
    profileMemberId,
    onOpenProfile,
  };
};
