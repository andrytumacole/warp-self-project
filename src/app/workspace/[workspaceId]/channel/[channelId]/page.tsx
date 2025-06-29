"use client";

import useGetChannelById from "@/api/channels/use-get-channel-by-id";
import ChannelHeader from "@/components/channels/channel-header";
import useGetChannelId from "@/hooks/use-get-channel-id";
import { Loader, TriangleAlert } from "lucide-react";

function ChannelIdPage() {
  const channelId = useGetChannelId();
  const { channel, isLoading: isFetchingChannel } = useGetChannelById({
    channelId: channelId,
  });

  if (!channel) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        {isFetchingChannel ? (
          <>
            <Loader className="animate-spin size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Loading channel
            </span>
          </>
        ) : (
          <>
            <TriangleAlert className="size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Channel not found
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ChannelHeader channelName={channel.name} />
    </div>
  );
}

export default ChannelIdPage;
