import { Doc } from "../../../convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown, SquarePen } from "lucide-react";
import Hint from "../global/tooltip";
import { useState } from "react";
import PreferencesModal from "./workspace-modals/preferences-modal";
import InviteToWorkspaceModal from "./workspace-modals/InviteToWorkspaceModal";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

function WorkspaceHeader(props: Readonly<WorkspaceHeaderProps>) {
  const { workspace, isAdmin } = props;
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <>
      <InviteToWorkspaceModal
        isOpen={isInviteModalOpen}
        setIsOpen={setIsInviteModalOpen}
        workspaceName={workspace.name}
        joinCode={workspace.joinCode}
        workspaceId={workspace._id}
      />

      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        setIsOpen={setIsPreferencesModalOpen}
        initialWorkspaceName={workspace.name}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"transparent"}
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden focus-visible:ring-0 "
              size={"sm"}
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            className="w-64 space-y-1"
          >
            <DropdownMenuItem className="cursor-pointer capitalize bg-gray-100/80 focus:bg-gray-300">
              <div className="flex justify-center items-center size-9 relative overflow-hidden text-black border-black border bg-white font-semibold text-lg rounded-md mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isAdmin && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer bg-slate-100/80 py-2 focus:bg-gray-300"
                  onClick={() => setIsInviteModalOpen(true)}
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer bg-slate-100/80 py-2 focus:bg-gray-300"
                  onClick={() => setIsPreferencesModalOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-0.5 align-middle justify-center">
          <Hint label="New message" side="bottom">
            <Button variant={"transparent"} size={"iconSm"}>
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
}

export default WorkspaceHeader;
