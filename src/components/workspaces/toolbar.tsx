import { Info, Search } from "lucide-react";
import { Button } from "../ui/button";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import useGetWorkspaceById from "@/app/api/use-get-workspace-by-id";

function Toolbar() {
  const workspaceId = useGetWorkspaceId();
  const { workspace } = useGetWorkspaceById({ id: workspaceId });

  return (
    <nav className="bg-gray-900 flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="w-[242px] grow-[2] shrink">
        <Button
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
          size="sm"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
}

export default Toolbar;
