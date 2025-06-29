import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetChannelByIdProp {
  channelId: Id<"channels">;
}

function useGetChannelById(props: Readonly<UseGetChannelByIdProp>) {
  const { channelId } = props;
  const channel = useQuery(api.channels.getById, {
    channelId: channelId,
  });
  const isLoading = channel === undefined;
  return { channel, isLoading };
}

export default useGetChannelById;
