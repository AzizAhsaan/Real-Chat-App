import { ConvexError } from "convex/values"
import {query} from "./_generated/server"
import { getUserByClerkId } from "./_utils"
export const get = query({args:{},
    handler:async (ctx,args) => {
        const identity  =  await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error('Unauthorized')
        }
        const currentUser=  await getUserByClerkId({
            ctx,clerkId:identity.subject
        })
        
        if(!currentUser){
            throw new Error('User not found')
        }

        const conversationMemberShips = await ctx.db.query("conversationMembers").withIndex("by_memberId",q => q.eq("memberId",currentUser._id)).collect()
        const conversations = await Promise.all(conversationMemberShips?.map(async membership => {
            const  conversation = await ctx.db.get(membership.conversationId)
            if(!conversation){
                throw new ConvexError("Conversation not found")
            }
            return conversation
        }))

        const conversationsWithDetails = await Promise.all(conversations?.map(async (conversation,index) => {
        
            const allConversationMembership = await ctx.db.query("conversationMembers").withIndex("by_conversationId",q => q.eq("conversationId",conversation._id)).collect() 
            if(conversation.isGroup){
                return {conversation}
            }else{
                const otherMemebership = allConversationMembership.filter(membership => membership.memberId !== currentUser._id)[0]
                const otherMember = await ctx.db.get(otherMemebership.memberId)
                return {conversation,otherMember}
            }
        }))
        return conversationsWithDetails 

    }
})