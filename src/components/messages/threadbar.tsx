import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ThreadbarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  onClick?: () => void;
}

function Threadbar(props: Readonly<ThreadbarProps>) {
  const { count, image, timestamp, onClick } = props;

  if (!count || !timestamp) return null;

  const avatarFallbackContent = "M";

  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0 bg-sky-500 text-white flex items-center justify-center rounded-lg">
          <AvatarImage src={image} className="rounded-lg" />
          <AvatarFallback>{avatarFallbackContent}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count}
          {count > 1 ? " replies" : " reply"}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0 flex items-center" />
    </button>
  );
}

export default Threadbar;
