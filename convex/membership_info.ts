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
    const membershipInfo = await checkAuthorizedUserRole(
      ctx,
      args.workspaceId,
      userId
    );

    return membershipInfo;
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

export const getById = query({
  args: {
    memberId: v.id("membershipInfos"),
  },
  handler: async (ctx, args) => {
    let userId;
    try {
      userId = await checkAuthorizedUser(ctx);
    } catch {
      return null;
    }

    const membershipInfo = await ctx.db.get(args.memberId);

    if (!membershipInfo) return null;

    const currentMembershipInfo = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", membershipInfo.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMembershipInfo) return null;

    const user = await ctx.db.get(membershipInfo.userId);
    if (!user) return null;

    return {
      ...membershipInfo,
      user,
    };
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

export const update = mutation({
  args: {
    id: v.id("membershipInfos"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);

    const membershipInfo = await ctx.db.get(args.id);
    if (!membershipInfo)
      throw new ConvexError({
        message: "[client][update membership info] member not found",
      });

    const currMembershipInfo = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", membershipInfo.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currMembershipInfo || currMembershipInfo.role !== "admin") {
      throw new ConvexError({
        message: "[client][update membership info]: Unauthorized user",
      });
    }

    await ctx.db.patch(args.id, {
      role: args.role,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("membershipInfos"),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);

    const membershipInfo = await ctx.db.get(args.id);
    if (!membershipInfo)
      throw new ConvexError({
        message: "[client][remove membership info] member not found",
      });

    const currMembershipInfo = await ctx.db
      .query("membershipInfos")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", membershipInfo.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currMembershipInfo) {
      throw new ConvexError({
        message: "[client][remove membership info]: Unauthorized user",
      });
    }

    if (membershipInfo.role === "admin") {
      throw new ConvexError({
        message:
          "[client][remove membership info]: Cannot remove an admin in the workspace",
      });
    }

    if (
      currMembershipInfo._id === args.id &&
      currMembershipInfo.role === "admin"
    ) {
      throw new ConvexError({
        message:
          "[client][remove membership info]: Cannot remove self if an admin in the workspace",
      });
    }

    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) =>
          q.eq("membershipInfoId", membershipInfo._id)
        )
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) =>
          q.eq("membershipInfoId", membershipInfo._id)
        )
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), membershipInfo._id),
            q.eq(q.field("memberTwoId"), membershipInfo._id)
          )
        )
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    for (const convo of conversations) {
      await ctx.db.delete(convo._id);
    }

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
  if (!membershipInfo)
    throw new ConvexError({
      message: "[client][workspace preferences]: Unauthorized user",
    });

  return membershipInfo;
}
