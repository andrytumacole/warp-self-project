import { useState } from "react";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmojiPopoverProps {
  hint?: string;
  children: React.ReactNode;
  onEmojiSelect: (emoji: { native: string }) => void;
}

function EmojiPopover(props: Readonly<EmojiPopoverProps>) {
  const { children, hint = "Emoji", onEmojiSelect } = props;

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  function onSelect(emoji: { native: string }) {
    onEmojiSelect(emoji);
    setIsPopoverOpen(false);

    setTimeout(() => {
      setIsTooltipOpen(false);
    }, 500);
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <TooltipProvider>
        <Tooltip
          open={isTooltipOpen}
          onOpenChange={setIsTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black/50 text-white border border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <Picker data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </TooltipProvider>
    </Popover>
  );
}

export default EmojiPopover;
