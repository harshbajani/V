import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
];

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const vision = await ctx.db.insert("visions", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });
    return vision;
  },
});

export const remove = mutation({
  args: { id: v.id("visions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_vision", (q) =>
        q.eq("userId", userId).eq("visionId", args.id)
      )
      .unique();
    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: { id: v.id("visions"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const title = args.title.trim();

    if (!title) {
      throw new Error("Title cannot be empty");
    }
    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }
    const vision = await ctx.db.patch(args.id, {
      title: args.title,
    });
    return vision;
  },
});

export const favorite = mutation({
  args: { id: v.id("visions"), orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const vision = await ctx.db.get(args.id);

    if (!vision) {
      throw new Error("Vision not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_vision", (q) =>
        q.eq("userId", userId).eq("visionId", vision._id)
      )
      .unique();
    if (existingFavorite) {
      throw new Error("Vision already favorited");
    }
    await ctx.db.insert("userFavorites", {
      userId,
      visionId: vision._id,
      orgId: args.orgId,
    });
    return vision;
  },
});

export const unfavorite = mutation({
  args: { id: v.id("visions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const vision = await ctx.db.get(args.id);

    if (!vision) {
      throw new Error("Vision not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_vision", (q) =>
        q.eq("userId", userId).eq("visionId", vision._id)
      )
      .unique();
    if (!existingFavorite) {
      throw new Error("Favorited vision does not exist");
    }
    await ctx.db.delete(existingFavorite._id);

    return vision;
  },
});

export const get = query({
  args: { id: v.id("visions")},
  handler: async (ctx, args) => {
    const vision = await ctx.db.get(args.id);

    return vision;
  }
})