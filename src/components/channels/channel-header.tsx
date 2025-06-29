import { FaChevronDown } from "react-icons/fa";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";

interface ChannelHeaderProps {
  channelName: string;
}

function ChannelHeader(props: Readonly<ChannelHeaderProps>) {
  const { channelName } = props;
  return (
    <div className="flex items-center px-4 bg-white border-b h-[49px] overflow-hidden">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size={"sm"}
          >
            <span className="truncate"># {channelName}</span>
            <FaChevronDown className="ml-1" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden [&>button]:hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {channelName}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <div className="px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Channel name</p>
                <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                  Edit
                </p>
              </div>
              <p className="text-sm"># {channelName}</p>
            </div>
            <button className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600">
              <TrashIcon className="size-4 " />
              <p className="text-sm font-semibold">Delete channel</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChannelHeader;
