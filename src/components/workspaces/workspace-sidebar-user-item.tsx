import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import { Id } from "../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

//dynamic creation of variant classnames
const workspaceSidebarUserItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
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

interface WorkspaceSidebarUserItemProp {
  id: Id<"membershipInfos">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof workspaceSidebarUserItemVariants>["variant"];
}

function WorkspaceSidebarUserItem(
  props: Readonly<WorkspaceSidebarUserItemProp>
) {
  const { id, label = "Member", image, variant } = props;
  const workspaceId = useGetWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();
  return (
    <Button
      variant={"transparent"}
      className={cn(workspaceSidebarUserItemVariants({ variant: variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image}></AvatarImage>
          <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
}

export default WorkspaceSidebarUserItem;
