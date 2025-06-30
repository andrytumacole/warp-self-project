import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new ConvexError({
        message: "[error][update message]: Message not found",
      });
    }

    const membershipInfo = await getMembershipInfo(
      ctx,
      message.workspaceId,
      userId
    );

    if (!membershipInfo) {
      throw new ConvexError({
        message: "[error][update message]: Unauthorized user",
      });
    }

    const existingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("membershipInfoId"), membershipInfo._id),
          q.eq(q.field("value"), args.value)
        )
      )
      .first();

    if (existingMessageReactionFromUser) {
      const existingReactionId = await ctx.db.delete(
        existingMessageReactionFromUser._id
      );
      return existingReactionId;
    } else {
      const newReactionId = await ctx.db.insert("reactions", {
        value: args.value,
        membershipInfoId: membershipInfo._id,
        messageId: message._id,
        workspaceId: message.workspaceId,
      });
      return newReactionId;
    }
  },
});

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

async function checkAuthorizedUser(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError({
      message: "[client][channels]: Unauthorized user",
    });
  }
  return userId;
}
