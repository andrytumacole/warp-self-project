import useGetWorkspaceId from "@/hooks/use-get-workspace-id";

import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "../ui/button";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

//dynamic creation of variant classnames
const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface WorkspaceSidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

function WorkspaceSidebarItem(props: Readonly<WorkspaceSidebarItemProps>) {
  const { label, icon: Icon, id, variant } = props;
  const workspaceId = useGetWorkspaceId();
  return (
    <Button
      variant={"transparent"}
      size={"sm"}
      className={cn(sidebarItemVariants({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  );
}

export default WorkspaceSidebarItem;
