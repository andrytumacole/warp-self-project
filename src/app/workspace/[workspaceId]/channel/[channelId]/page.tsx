"use client";

import useGetChannelById from "@/api/channels/use-get-channel-by-id";
import ChannelHeader from "@/components/channels/channel-header";
import useGetChannelId from "@/hooks/use-get-channel-id";

function ChannelIdPage() {
  const channelId = useGetChannelId();
  const { channel, isLoading: isFetchingChannel } = useGetChannelById({
    channelId: channelId,
  });

  return (
    <div className="h-full flex flex-col">
      <ChannelHeader />
    </div>
  );
}

export default ChannelIdPage;
