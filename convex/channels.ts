import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await checkAuthorizedUser(ctx);
      await checkAuthorizedUserRole(ctx, args.workspaceId, userId);
    } catch {
      return [];
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    return channels;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);
    const membershipInfo = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    //user is not a member and not an admin of the request workspace by id
    if (!membershipInfo || membershipInfo.role !== "admin") {
      throw new ConvexError({
        message: "[client][workspace preferences]: Unauthorized user",
      });
    }

    //in cases where they can bypass the autocorrect in the frontend
    const parsedValue = args.name.replace(/\s+/g, "-").toLowerCase();

    const channelId = await ctx.db.insert("channels", {
      name: parsedValue,
      workspaceId: args.workspaceId,
    });

    return channelId;
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
}
