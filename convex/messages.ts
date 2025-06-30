import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator, //convex handler for pagination (lazy loading esque)
  },
  handler: async (ctx, args) => {
    try {
      const _userId = await checkAuthorizedUser(ctx);

      let _conversationId = args.conversationId;

      // Only possible if we are replying in a thread in 1:1 conversation
      //in this case, the url does not contain the conversationId. also note that it does not come from a channel (from dm)
      //what we have is a parentMessageId, so we will refer to that
      if (!args.conversationId && !args.channelId && args.parentMessageId) {
        const parentMessage = await ctx.db.get(args.parentMessageId);

        if (!parentMessage) {
          throw new ConvexError({
            message: "[client][messages]: Parent message not found",
          });
        }

        //now we can refer to itself meaning that we are replying from a message in a one-to-one thread (dm)
        _conversationId = parentMessage.conversationId;
      }
      const results = await ctx.db
        .query("messages")
        .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
          q
            .eq("channelId", args.channelId)
            .eq("parentMessageId", args.parentMessageId)
            .eq("conversationId", _conversationId)
        )
        .order("desc")
        .paginate(args.paginationOpts);

      return {
        ...results,
        page: await Promise.all(
          results.page
            .map(async (message) => {
              const membershipInfo = await populateMembershipInfo(
                ctx,
                message.membershipInfoId
              );
              const user = membershipInfo
                ? await populateUser(ctx, membershipInfo.userId)
                : null;

              if (!membershipInfo || !user) {
                return null;
              }

              const reactions = await populateReactions(ctx, message._id);
              const thread = await populateThread(ctx, message._id);
              const image = message.image
                ? await ctx.storage.getUrl(message.image)
                : undefined;

              //normalize the reactions of message
              const reactionsWithCounts = reactions.map((reaction) => {
                //each reaction will have an additional count prop
                return {
                  //extract the rest of the reaction props
                  ...reaction,
                  //counts how many reactions are equal to the curr reaction
                  count: reactions.filter((r) => r.value === reaction.value)
                    .length,
                };
              });

              //reduce the reactions to unique reactions
              const dedupedReactions = reactionsWithCounts.reduce(
                (acc, reaction) => {
                  //check if reaction is in acc already
                  const existingReaction = acc.find(
                    (r) => r.value === reaction.value
                  );

                  //if it is then add membership info about who sent that reaction
                  if (existingReaction) {
                    existingReaction.membershipInfoIds = Array.from(
                      new Set([
                        ...existingReaction.membershipInfoIds,
                        reaction.membershipInfoId,
                      ])
                    );
                  } else {
                    acc.push({
                      ...reaction,
                      membershipInfoIds: [reaction.membershipInfoId],
                    });
                  }

                  return acc;
                },
                [] as (Doc<"reactions"> & {
                  count: number;
                  membershipInfoIds: Id<"membershipInfos">[];
                })[]
              );

              const reactionsWithoutMemberIdProp = dedupedReactions.map(
                //extract membershipInfoId and then return the rest
                ({ membershipInfoId, ...rest }) => rest
              );

              return {
                ...message,
                image,
                user,
                membershipInfo: membershipInfo,
                reactions: reactionsWithoutMemberIdProp,
                threadCount: thread.count,
                threadImage: thread.image,
                threadTimestamp: thread.timestamp,
              };
            })
            .filter((message) => message !== null) //removes null messages
        ),
      };
    } catch (e) {
      console.log("error: " + e);

      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
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

    let _conversationId = args.conversationId;

    // Only possible if we are replying in a thread in 1:1 conversation
    //in this case, the url does not contain the conversationId. also note that it does not come from a channel (from dm)
    //what we have is a parentMessageId, so we will refer to that
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new ConvexError({
          message: "[client][messages]: Parent message not found",
        });
      }

      //now we can refer to itself meaning that we are replying from a message in a one-to-one thread (dm)
      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      membershipInfoId: membershipInfo._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      conversationId: _conversationId,
      parentMessageId: args.parentMessageId,
    });

    return messageId;
  },
});

export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuthorizedUser(ctx);

    const message = await ctx.db.get(args.id);

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

    if (!membershipInfo || membershipInfo._id !== message.membershipInfoId) {
      throw new ConvexError({
        message: "[error][update message]: Unauthorized user",
      });
    }

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });
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

async function populateUser(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db.get(userId);
}

async function populateMembershipInfo(
  ctx: QueryCtx,
  membershipInfoId: Id<"membershipInfos">
) {
  return await ctx.db.get(membershipInfoId);
}

//get the reactions of the message with this id
async function populateReactions(ctx: QueryCtx, messageId: Id<"messages">) {
  return await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
}

//get the replies of the message with this id
async function populateThread(ctx: QueryCtx, messageId: Id<"messages">) {
  //the index (parentMessageId) implies that it can only be a reply if it exists since it has a parent message
  const replyMessages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();

  if (replyMessages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastReplyMessage = replyMessages[replyMessages.length - 1];
  const lastMessageMember = await populateMembershipInfo(
    ctx,
    lastReplyMessage.membershipInfoId
  );

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastReplyMessageUser = await populateUser(
    ctx,
    lastMessageMember.userId
  );

  return {
    count: replyMessages.length,
    image: lastReplyMessageUser?.image,
    timestamp: lastReplyMessage._creationTime,
  };
}
