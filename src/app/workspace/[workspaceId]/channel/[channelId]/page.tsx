"use client";

import useGetChannelById from "@/api/channels/use-get-channel-by-id";
import useGetChannelId from "@/hooks/use-get-channel-id";

function ChannelIdPage() {
  const channelId = useGetChannelId();
  const { channel, isLoading: isFetchingChannel } = useGetChannelById({
    channelId: channelId,
  });

  return (
    <div className="h-full flex items-center justify-center">Channel page</div>
  );
}

export default ChannelIdPage;
