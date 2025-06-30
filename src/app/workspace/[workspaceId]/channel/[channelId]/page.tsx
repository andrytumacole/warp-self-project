"use client";

import useGetChannelById from "@/api/channels/use-get-channel-by-id";
import useGetMessages from "@/api/messages/use-get-message";
import ChannelHeader from "@/components/channels/channel-header";
import ChatInput from "@/components/channels/chat-input";
import MessageList from "@/components/messages/messages-list";
import useGetChannelId from "@/hooks/use-get-channel-id";
import { Loader, TriangleAlert } from "lucide-react";

function ChannelIdPage() {
  const channelId = useGetChannelId();
  const { channel, isLoading: isFetchingChannel } = useGetChannelById({
    channelId: channelId,
  });
  const { results, status, loadMore } = useGetMessages({
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
      <ChannelHeader initialChannelName={channel.name} />
      {/* placeholder component that takes all remaining space and pushing down the text input */}
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        data={results}
        variant="channel"
      />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
}

export default ChannelIdPage;
