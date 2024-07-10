import { ConvexError, v } from "convex/values"
import {mutation, query} from "./_generated/server"
import { getUserByClerkId } from "./_utils"
export const get = query({args:{
    id:v.id("conversations")
},
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
        const conversation = await ctx.db.get(args.id)
        if(!conversation){
            console.log("conversation not found")
            throw new ConvexError("Conversation not found")
        }
        

        const membership = await ctx.db.query("conversationMembers")
        .withIndex("by_memberId_conversationId", (q) => q.eq("conversationId", conversation._id).eq("memberId", currentUser._id))
        .unique();        if(!membership){
            throw new ConvexError("You're not a member of this conversation")
        } 

        const allConversationMemberShips =await  ctx.db.query("conversationMembers").withIndex("by_conversationId",(q) => q.eq("conversationId",args.id)).collect()
        if(!conversation.isGroup){
            const otherMemebership = await allConversationMemberShips.filter(membership => membership.memberId !== currentUser._id)[0]
            const otherMemberDetails = await ctx.db.get(otherMemebership.memberId)
            return {
                ...conversation,
                otherMember:{
                    ...otherMemberDetails,
                    lastSeenMessage:otherMemebership.lastSeenMessage
                },
                otherMembers:null
            }

        }

    }
})

export const deleteConversation = mutation({
    args:{
        id:v.id("conversations"),
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
        const conversation = await ctx.db.get(args.id)
        if(!conversation){
            throw new ConvexError("Conversation not found")
        }

        const membership = await ctx.db.query("conversationMembers")
        .withIndex("by_memberId_conversationId", (q) => q.eq("conversationId", conversation._id).eq("memberId", currentUser._id))
        .unique();        
        if(!membership){
            throw new ConvexError("You're not a member of this conversation")
        }

        const allConversationMemberShips = await ctx.db.query("conversationMembers").withIndex("by_conversationId",(q) => q.eq("conversationId",args.id)).collect()
        if(!conversation.isGroup){
            await Promise.all(allConversationMemberShips.map(async (membership) => {
                await ctx.db.delete(membership._id)
            }))
        }
        await ctx.db.delete(args.id)
        return true


    }

})

export const create = mutation({
    args:{id:v.id("users")},
    handler:async(ctx,args) => {
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

        const otherUser = await ctx.db.get(args.id)
        if(!otherUser){
            throw new ConvexError("User not found")
        }
        
        const conversationId = await ctx.db.insert("conversations", {
            isGroup:false,
        })
        await ctx.db.insert("conversationMembers",{
            memberId:currentUser._id,
            conversationId,
        })
        await ctx.db.insert("conversationMembers",{
            memberId:args.id,
            conversationId,
        })
    }
})
