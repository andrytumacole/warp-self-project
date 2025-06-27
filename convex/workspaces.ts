import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

function generateRandomCode() {
  const digits = "0123456789";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const randomCode = Array.from(
    { length: 6 },
    () => (digits + letters)[Math.floor(Math.random() * 36)]
  ).join("");
  return randomCode;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await checkAuthorizedUser(ctx);
    //check which workspaces the user is a member of
    const filteredWorkspaces = await ctx.db
      .query("membershipInfos")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
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
    const joinCode = generateRandomCode();
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    //when a user creates a workspace,
    //that user should be added on the members as admin
    await ctx.db.insert("membershipInfos", {
      userId: userId,
      workspaceId: workspaceId,
      role: "admin",
    });

    await ctx.db.insert("channels", {
      name: "General",
      workspaceId: workspaceId,
    });

    return workspaceId;
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);

    //query if the current user is a member of the args workspace
    const membershipInfo = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();

    //user is not a member of the request workspace by id
    if (!membershipInfo) return null;

    const workspace = await ctx.db.get(args.id);
    return workspace;
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);

    //check if user is in the workspace or an admin
    await checkAuthorizedUserRole(ctx, args.id, userId);

    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);

    //check if user is in the workspace or an admin
    await checkAuthorizedUserRole(ctx, args.id, userId);

    //get all membership info related to the workspace to be deleted
    const [membershipInfos] = await Promise.all([
      ctx.db
        .query("membershipInfos")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);

    //delete each associated membership info
    for (const memInfo of membershipInfos) {
      await ctx.db.delete(memInfo._id);
    }

    //delete the workspace doc
    await ctx.db.delete(args.id);

    return args.id;
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
