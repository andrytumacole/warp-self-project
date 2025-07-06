import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import useGetWorkspaceById from "@/api/workspaces/use-get-workspace-by-id";
import useGetChannelsByWorkspaceId from "@/api/channels/use-get-channels-by-workspace-id";
import useGetMembersByWorkspaceId from "@/api/membership-infos/use-get-members-by-workspace-id";
import { useState } from "react";

import { Info, Search } from "lucide-react";
import { Button } from "../ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

function Toolbar() {
  const router = useRouter();
  const workspaceId = useGetWorkspaceId();
  const { workspace } = useGetWorkspaceById({ id: workspaceId });
  const { channels, isLoading: _isFetchingChannels } =
    useGetChannelsByWorkspaceId({ workspaceId: workspaceId });
  const { members, isLoading: _isFetchingMembers } = useGetMembersByWorkspaceId(
    {
      workspaceId: workspaceId,
    }
  );
  const [open, setOpen] = useState(false);

  function handleChannelClick(channelId: string) {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  }

  function handleMemberClick(memberId: string) {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  }

  return (
    <nav className="bg-gray-900 flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="w-[242px] grow-[2] shrink">
        <Button
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a channel or member name to search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => {
                return (
                  <CommandItem
                    key={channel._id}
                    onSelect={() => handleChannelClick(channel._id)}
                  >
                    {channel.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => {
                return (
                  <CommandItem
                    key={member._id}
                    onSelect={() => handleMemberClick(member._id)}
                  >
                    {member.user.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
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
