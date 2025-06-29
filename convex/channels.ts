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

export const getById = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db
      .query("channels")
      .withIndex("by_id", (q) => q.eq("_id", args.channelId))
      .unique();

    if (!channel) return null;

    try {
      const userId = await checkAuthorizedUser(ctx);
      await checkAuthorizedUserRole(ctx, channel.workspaceId, userId);
    } catch {
      return null;
    }

    return channel;
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
        message: "[client][channels]: Unauthorized user",
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

export const update = mutation({
  args: {
    channelId: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);

    const channel = await ctx.db
      .query("channels")
      .withIndex("by_id", (q) => q.eq("_id", args.channelId))
      .unique();

    if (!channel)
      throw new ConvexError({
        message: "[client][channels]: Channel not found",
      });

    //query if the current user is a member of the args workspace
    const membershipInfo = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    //user is not an admin of the workspace
    if (!membershipInfo || membershipInfo.role !== "admin") {
      throw new ConvexError({
        message: "[client][channels]: Unauthorized user",
      });
    }

    await ctx.db.patch(args.channelId, {
      name: args.name,
    });

    return args.channelId;
  },
});

export const remove = mutation({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);

    const channel = await ctx.db
      .query("channels")
      .withIndex("by_id", (q) => q.eq("_id", args.channelId))
      .unique();

    if (!channel)
      throw new ConvexError({
        message: "[client][channels]: Channel not found",
      });

    //query if the current user is a member of the args workspace
    const membershipInfo = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    //user is not an admin of the workspace
    if (!membershipInfo || membershipInfo.role !== "admin") {
      throw new ConvexError({
        message: "[client][channels]: Unauthorized user",
      });
    }

    await ctx.db.delete(args.channelId);

    return args.channelId;
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
  if (!membershipInfo) {
    throw new ConvexError({
      message: "[client][channels]: Unauthorized user",
    });
  }
}
