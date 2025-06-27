import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "../ui/button";
import Link from "next/link";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";

interface WorkspaceSidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
}

function WorkspaceSidebarItem(props: Readonly<WorkspaceSidebarItemProps>) {
  const { label, icon: Icon, id } = props;
  const workspaceId = useGetWorkspaceId();
  return (
    <Button variant={"transparent"} size={"sm"} asChild>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon />
        <span>{label}</span>
      </Link>
    </Button>
  );
}

export default WorkspaceSidebarItem;
