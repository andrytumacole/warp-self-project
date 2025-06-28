import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    //get the member info of current user
    const member = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return null;
    }

    return member;
  },
});

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

    const membershipInfos = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const members = [];

    for (const memberInfo of membershipInfos) {
      const user = await ctx.db.get(memberInfo.userId);
      if (user) members.push({ ...memberInfo, user });
    }

    return members;
  },
});

export const join = mutation({
  args: {
    joinCode: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);
    const joinCode = args.joinCode.toLowerCase();

    const workspace = await ctx.db.get(args.workspaceId);

    if (!workspace) {
      throw new ConvexError({
        message: "[Error][Server] Workspace not found in the database",
      });
    }

    if (workspace.joinCode !== joinCode) {
      throw new ConvexError({
        message: "[Error][Client] Invalid join code",
      });
    }

    const isExistingMember = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (isExistingMember)
      throw new ConvexError({
        message: "[Error][Client] User is already a member of the workspace",
      });

    await ctx.db.insert("membershipInfos", {
      workspaceId: args.workspaceId,
      userId: userId,
      role: "member",
    });

    return args.workspaceId;
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
  if (!membershipInfo || membershipInfo.role !== "admin")
    throw new ConvexError({
      message: "[client][workspace preferences]: Unauthorized user",
    });
}
