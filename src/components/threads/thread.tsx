import { XIcon } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

function Thread(props: Readonly<ThreadProps>) {
  const { messageId, onClose } = props;
  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
    </div>
  );
}
export default Thread;
