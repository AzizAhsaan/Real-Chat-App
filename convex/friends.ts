import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query(
    {args:{},
    handler:async (ctx,args) => {
        const identity  =  await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error('Unauthorized')
        }
        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        const userFriends1 = await ctx.db.query("friends").withIndex("by_user1", (q) => q.eq("user1", currentUser._id)).collect();
        const userFriends2 = await ctx.db.query("friends").withIndex("by_user2", (q) => q.eq("user2", currentUser._id)).collect();
        const userFriends = [...userFriends1, ...userFriends2];

        const friendsDetails = await Promise.all(userFriends.map(async (friend) => {
            const friendId = friend.user1 === currentUser._id ? friend.user2 : friend.user1;
            const memberMembers = await ctx.db.query("conversationMembers")
            .withIndex("by_memberId", (q) => q.eq("memberId", friendId))
            .collect();

            const existingConversation = memberMembers.find(cm => cm.memberId !== currentUser._id);
            if (!existingConversation) {
                const friendDetails = await ctx.db.get(friendId);
                return { ...friend, friendDetails: friendDetails ? [friendDetails] : [] };
            }
            return null;
        }));
        const filteredFriendsDetails = friendsDetails.filter(details => details !== null);

        return filteredFriendsDetails

    }
}
)



export const GetAllFriends = query(
    {args:{},
    handler:async (ctx,args) => {
        const identity  =  await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error('Unauthorized')
        }
        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        const userFriends1 = await ctx.db.query("friends").withIndex("by_user1", (q) => q.eq("user1", currentUser._id)).collect();
        const userFriends2 = await ctx.db.query("friends").withIndex("by_user2", (q) => q.eq("user2", currentUser._id)).collect();
        const userFriends = [...userFriends1, ...userFriends2];

        const friendsDetails = await Promise.all(userFriends.map(async (friend) => {
            const friendId = friend.user1 === currentUser._id ? friend.user2 : friend.user1;

                const friendDetails = await ctx.db.get(friendId);
                return { ...friend, friendDetails: friendDetails ? [friendDetails] : [] };
        }));

        return friendsDetails

    }
}
)


export const deleteFriend = mutation({
    args:{
        id:v.id("users"),
    },
    handler:async(ctx,args) => {
        const identity  =  await ctx.auth.getUserIdentity()
        if(!identity){
            throw new ConvexError('Unauthorized')
        }
        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }
        const Friend = await ctx.db.get(args.id)
        if (!Friend) {
            throw new ConvexError('Friend not found');
        }
        if(Friend._id === currentUser._id){
            throw new ConvexError('You cannot delete yourself');
        }

        const friendshipss = await ctx.db.query("friends").collect()

        friendshipss.forEach(async (friendship) => {
            if(friendship.user1 === currentUser._id && friendship.user2 === Friend._id || friendship.user1 === Friend._id && friendship.user2 === currentUser._id){
                await ctx.db.delete(friendship._id)
            }
        })

        const conversationMemberships = await ctx.db.query("conversationMembers").collect()
        conversationMemberships.forEach(async (membership) => {
            if(membership.memberId === currentUser._id || membership.memberId === Friend._id){
                await ctx.db.delete(membership._id)
            }
        })



    }
})