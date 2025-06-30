import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import useGetCurrentMembershipInfo from "@/api/membership-infos/use-get-current-membership-info";
import { cn } from "@/lib/utils";
import Hint from "../global/tooltip";
import EmojiPopover from "../input/emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionsBarProps {
  data: Array<
    Omit<Doc<"reactions">, "membershipInfoId"> & {
      count: number;
      membershipInfoIds: Id<"membershipInfos">[];
    }
  >;
  onChange: (value: string) => void;
}

function ReactionsBar(props: Readonly<ReactionsBarProps>) {
  const { data, onChange } = props;
  const workspaceId = useGetWorkspaceId();
  const { membershipInfo: userMembershipInfo } = useGetCurrentMembershipInfo({
    workspaceId: workspaceId,
  });

  const membershipInfoId = userMembershipInfo?._id;

  if (data.length === 0 || !membershipInfoId) return null;

  return (
    <div className="flex items-center gap-1 my-1 ">
      {data.map((reaction) => {
        const didCreateReaction =
          reaction.membershipInfoIds.includes(membershipInfoId);
        const reactionCount = reaction.count;
        return (
          <Hint
            key={reaction._id}
            label={`${reactionCount} ${reactionCount === 1 ? "person" : "people"} reacted with ${reaction.value}`}
          >
            <button
              className={cn(
                "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
                didCreateReaction && "bg-blue-100/70 border-blue-500"
              )}
              onClick={() => onChange(reaction.value)}
            >
              {reaction.value}
              <span
                className={cn(
                  "text-xs font-semibold text-muted-foreground",
                  didCreateReaction && "text-blue-500"
                )}
              >
                {reaction.count}
              </span>
            </button>
          </Hint>
        );
      })}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover: border-slate-500 text-slate-800 flex items-center gap-x-1">
          <MdOutlineAddReaction />
        </button>
      </EmojiPopover>
    </div>
  );
}

export default ReactionsBar;
