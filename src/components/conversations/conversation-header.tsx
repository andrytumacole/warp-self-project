import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaChevronDown } from "react-icons/fa";

interface ConversationHeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

function ConversationHeader(props: Readonly<ConversationHeaderProps>) {
  const { memberName = "Member", memberImage, onClick } = props;

  const avatarFallbackContent = memberName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between px-4 bg-white border-b h-[49px] overflow-hidden">
      <Button
        variant="ghost"
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size="sm"
        onClick={onClick}
      >
        <Avatar className="size-8 bg-sky-500 text-white flex items-center justify-center rounded-lg">
          <AvatarImage src={memberImage} className="rounded-lg" />
          <AvatarFallback>{avatarFallbackContent}</AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
}

export default ConversationHeader;
