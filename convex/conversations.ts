import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createOrGet = mutation({
  args: {
    memberId: v.id("membershipInfos"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);
    const firstMembershipInfo = await checkAuthorizedUserRole(
      ctx,
      args.workspaceId,
      userId
    );

    const secondMembershipInfo = await ctx.db.get(args.memberId);
    if (!secondMembershipInfo) {
      throw new ConvexError({
        message: "[client][conversation] Member not found",
      });
    }

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("memberOneId"), firstMembershipInfo._id),
            q.eq(q.field("memberTwoId"), secondMembershipInfo._id)
          ),
          q.and(
            q.eq(q.field("memberTwoId"), firstMembershipInfo._id),
            q.eq(q.field("memberOneId"), secondMembershipInfo._id)
          )
        )
      )
      .unique();

    if (existingConversation) return existingConversation._id;

    const conversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      memberOneId: firstMembershipInfo._id,
      memberTwoId: secondMembershipInfo._id,
    });

    const conversation = await ctx.db.get(conversationId);

    if (!conversation) {
      throw new ConvexError({
        message:
          "[client][conversation] Something went wrong in creating the conversation",
      });
    }

    return conversationId;
  },
});

async function checkAuthorizedUser(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError({
      message: "[client][workspace creation]: Unauthorized user",
    });
  }
  return userId;
}

async function checkAuthorizedUserRole(
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

  //user is not a member of the request workspace by id
  if (!membershipInfo)
    throw new ConvexError({
      message: "[client][workspace preferences]: Unauthorized user",
    });

  return membershipInfo;
}
