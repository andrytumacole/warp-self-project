import { ConvexError, v } from "convex/values";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = checkAuthorizedUser(ctx);

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
    return channels;
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
