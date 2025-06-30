import { defineSchema, defineTable } from "convex/server";
import { Validator, v } from "convex/values";

// The users, accounts, sessions and verificationTokens tables are modeled
// from https://authjs.dev/getting-started/adapters#models

//copy pasted from next-auth adapter

export const userSchema = {
  email: v.string(),
  name: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  emailVerificationTime: v.optional(v.float64()),
  image: v.optional(v.string()),
};

export const sessionSchema = {
  userId: v.id("users"),
  expires: v.number(),
  sessionToken: v.string(),
};

export const accountSchema = {
  userId: v.id("users"),
  type: v.optional(
    v.union(
      v.literal("email"),
      v.literal("oidc"),
      v.literal("oauth"),
      v.literal("webauthn")
    )
  ),
  provider: v.string(),
  providerAccountId: v.string(),
  refresh_token: v.optional(v.string()),
  access_token: v.optional(v.string()),
  expires_at: v.optional(v.number()),
  token_type: v.optional(v.string() as Validator<Lowercase<string>>),
  scope: v.optional(v.string()),
  id_token: v.optional(v.string()),
  session_state: v.optional(v.string()),
  secret: v.optional(v.string()),
};

export const verificationTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

export const authenticatorSchema = {
  credentialID: v.string(),
  userId: v.id("users"),
  providerAccountId: v.string(),
  credentialPublicKey: v.string(),
  counter: v.number(),
  credentialDeviceType: v.string(),
  credentialBackedUp: v.boolean(),
  transports: v.optional(v.string()),
};

const authTables = {
  users: defineTable(userSchema).index("email", ["email"]),
  sessions: defineTable(sessionSchema)
    .index("sessionToken", ["sessionToken"])
    .index("userId", ["userId"]),
  authAccounts: defineTable(accountSchema)
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userId", ["userId"]),
  verificationTokens: defineTable(verificationTokenSchema).index(
    "identifierToken",
    ["identifier", "token"]
  ),
  authenticators: defineTable(authenticatorSchema)
    .index("userId", ["userId"])
    .index("credentialID", ["credentialID"]),
  authVerifiers: defineTable({
    signature: v.optional(v.string()),
    timestamp: v.optional(v.float64()),
  }).index("signature", ["signature"]),

  authVerificationCodes: defineTable({
    accountId: v.id("authAccounts"),
    token: v.optional(v.string()),
    code: v.string(),
    expirationTime: v.float64(),
    provider: v.string(),
    verifier: v.string(),
  })
    .index("accountId", ["accountId"])
    .index("code", ["code"]),

  authRefreshTokens: defineTable({
    sessionId: v.string(),
    parentRefreshTokenId: v.optional(v.string()),
    expirationTime: v.float64(),
    firstUsedTime: v.optional(v.float64()),
    sessionIdAndParentRefreshTokenId: v.optional(v.string()),
  })
    .index("sessionId", ["sessionId"])
    .index("parentRefreshTokenId", ["parentRefreshTokenId"])
    .index("sessionIdAndParentRefreshTokenId", [
      "sessionId",
      "sessionIdAndParentRefreshTokenId",
    ]),

  authRateLimits: defineTable({
    identifier: v.string(),
    attemptsLeft: v.float64(),
    lastAttemptTime: v.float64(),
  }).index("identifier", ["identifier"]),

  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),

  membershipInfos: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),

  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  }).index("by_workspace_id", ["workspaceId"]),

  conversations: defineTable({
    //convos live in workspaces only and they can only happen one-to-one
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("membershipInfos"),
    memberTwoId: v.id("membershipInfos"),
  }).index("by_workspace_id", ["workspaceId"]),

  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")), //_storage is native collection
    membershipInfoId: v.id("membershipInfos"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")), //optional because it can come from dms
    parentMessageId: v.optional(v.id("messages")), //it can refer to itself like a reply
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["membershipInfoId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),

  reactions: defineTable({
    workspaceId: v.id("workspaces"), //on which workspace
    messageId: v.id("messages"), //on which message
    membershipInfoId: v.id("membershipInfos"), //which member sent this
    value: v.string(), //value of the emoji
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["membershipInfoId"]),
};

export default defineSchema({
  ...authTables,
  // your other tables
  // or pass `strictTableNameTypes: false`
  // in the second argument argument to `defineSchema`
});
