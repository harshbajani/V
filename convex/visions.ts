import { v } from "convex/values";
import { query } from "./_generated/server";
import {getAllOrThrow} from 'convex-helpers/server/relationships'

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (args.favorites) {
      const favoritedVisions = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      const ids = favoritedVisions.map((v) => v.visionId);
      const visions = await getAllOrThrow(ctx.db, ids);

      return visions.map((vision) => ({...vision, isFavorite: true}))
    }

    const title = args.search as string;
    let visions = [];

    if (title) {
      visions = await ctx.db
        .query("visions")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      visions = await ctx.db
        .query("visions")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }
    const visionWithFavoriteRelation = visions.map((vision) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_vision", (q) =>
          q.eq("userId", identity.subject).eq("visionId", vision._id)
        )
        .unique()
        .then((favorite) => {
          return {
            ...vision,
            isFavorite: !!favorite,
          };
        });
    });
    const visionWithFavoriteBoolean = Promise.all(visionWithFavoriteRelation);
    return visionWithFavoriteBoolean;
  },
});
