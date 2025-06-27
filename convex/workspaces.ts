import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await checkAuthorizedUser(ctx);
    //check which workspaces the user is a member of
    const filteredWorkspaces = await ctx.db
      .query("members")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const myWorkspacesIds = filteredWorkspaces.map(
      (workspace) => workspace.workspaceId
    );

    const myWorkspaces = [];
    for (const workspaceId of myWorkspacesIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) myWorkspaces.push(workspace);
    }
    return myWorkspaces;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);
    //edit this later
    const joinCode = "1234";
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    //when a user creates a workspace,
    //that user should be added on the members as admin
    await ctx.db.insert("members", {
      userId: userId,
      workspaceId: workspaceId,
      role: "admin",
    });

    return workspaceId;
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);

    //query if the current user is a member of the args workspace
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id")
      .filter(
        (q) =>
          q.eq(q.field("workspaceId"), args.id) &&
          q.eq(q.field("userId"), userId)
      )
      .unique();

    //user is not a member of the request workspace by id
    if (!member) return null;

    const workspace = await ctx.db.get(args.id);
    return workspace;
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
