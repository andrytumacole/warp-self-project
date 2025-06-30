import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);
    const membershipInfo = await getMembershipInfo(
      ctx,
      args.workspaceId,
      userId
    );

    if (!membershipInfo) {
      throw new ConvexError({
        message: "[client][messages]: Unauthorized member of workspace",
      });
    }

    let _conversationId = args.conversationId;

    // Only possible if we are replying in a thread in 1:1 conversation
    //in this case, the url does not contain the conversationId. also note that it does not come from a channel (from dm)
    //what we have is a parentMessageId, so we will refer to that
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new ConvexError({
          message: "[client][messages]: Parent message not found",
        });
      }

      //now we can refer to itself meaning that we are replying from a message in a one-to-one thread (dm)
      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      memberId: membershipInfo._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      conversationId: _conversationId,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

async function checkAuthorizedUser(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError({
      message: "[client][channels]: Unauthorized user",
    });
  }
  return userId;
}

async function getMembershipInfo(
  ctx: MutationCtx | QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) {
  //query if the current user is a member of the args workspace
  const membershipInfo = await ctx.db
    .query("membershipInfos")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();

  return membershipInfo;
}
