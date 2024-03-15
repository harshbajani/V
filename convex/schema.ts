import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  visions: defineTable({
    title: v.string(),
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.string(),
  })
    .index("by_org", ["orgId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"]
    }),
  userFavorites: defineTable({
    orgId: v.string(),
    userId: v.string(),
    visionId: v.id("visions")
  })
    .index("by_vision", ["visionId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_vision", ["userId", "visionId"])
    .index("by_user_vision_org", ["userId", "visionId", "orgId"])
});
