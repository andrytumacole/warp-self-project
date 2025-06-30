import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";
import useGetWorkspaces from "@/api/workspaces/use-get-workspaces";
import useGetWorkspaceById from "@/api/workspaces/use-get-workspace-by-id";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

function Switcher() {
  const router = useRouter();
  const [_isModalOpen, setIsModalOpen] = useCreateWorkspaceModal(); //atom state
  const workspaceId = useGetWorkspaceId(); //hook that fetches from params
  const { workspaces, isLoading: _isFetchingWorkspaces } = useGetWorkspaces(); //hook that uses useQuery
  const { workspace: currentWorkspace, isLoading: isFetchingWorkspace } =
    useGetWorkspaceById({
      id: workspaceId,
    }); //hook that uses useQuery

  const otherWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className=" outline-none focus:ring-0 focus: ring-offset-0 size-9 overflow-hidden bg-white hover:bg-white/80 text-slate-800 font-semibold text-xl">
          {isFetchingWorkspace ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            currentWorkspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64 space-y-1"
      >
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="w-full cursor-pointer grid grid-cols-1 justify-start items-start capitalize gap-0 bg-gray-100/80 overflow-hidden focus:bg-gray-300"
        >
          <p className="truncate whitespace-nowrap">{currentWorkspace?.name}</p>
          <span className="text-xs text-muted-foreground ">
            Current workspace
          </span>
        </DropdownMenuItem>
        {otherWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="capitalize cursor-pointer bg-gray-100/80 focus:bg-gray-300"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <p className="truncate">{workspace.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer bg-gray-100/80 focus:bg-gray-300"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="size-9 relative overflow-hidden flex justify-center items-center">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default Switcher;
