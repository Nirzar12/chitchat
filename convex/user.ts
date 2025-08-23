// import { v } from "convex/values";
// import { internalMutation, internalQuery } from "./_generated/server";

// export const create = internalMutation({
//   args: {
//     username: v.string(),
//     imageUrl: v.string(),
//     clerkId: v.string(),
//     email: v.string(),
//   },
//   handler: async (ctx, args) => {
//     // Optional: Validate inputs before insert
//     const id = await ctx.db.insert("users", args);
//     return id; // Return inserted document ID
//   },
// });

// export const get = internalQuery({
//   args: {
//     clerkId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     // Ensure the index exists in schema
//     return await ctx.db
//       .query("users")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
//       .unique(); // Or .collect() if multiple results expected
//   },
// });

import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// Insert a new user
export const create = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Inserting user into Convex:", args);
    const id = await ctx.db.insert("users", args);
    return id; // Return the inserted document ID
  },
});

// Get a user by clerkId
export const get = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique(); // Should return one user
  },
});

