import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

function useGetChannelId() {
  const params = useParams();
  return params.channelId as Id<"channels">;
}

export default useGetChannelId;
