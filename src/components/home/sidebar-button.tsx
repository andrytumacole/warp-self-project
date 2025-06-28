import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

function SidebarButton(props: Readonly<SidebarButtonProps>) {
  const { icon: Icon, label, isActive } = props;
  return (
    <div className="flex flex-col items-center justify-center cursor-pointer group">
      <Button
        variant={"transparent"}
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20",
          isActive && "bg-accent/20"
        )}
      >
        <Icon className="size-5 text-white group-hover:scale-110 transition-all" />
      </Button>
      <span
        className={cn(
          "text-[11px] text-gray-500 group-hover:text-white",
          isActive && "text-white"
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default SidebarButton;
