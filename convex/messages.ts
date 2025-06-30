import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    //TODO: add conversationId
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

    //Handle conversationId

    const messageId = await ctx.db.insert("messages", {
      memberId: membershipInfo._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
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
