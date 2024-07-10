//@ts-nocheck
'use client'
import ConversationContainer from '@/components/conversation/ConversationContainer'
import { useQuery } from 'convex/react'
import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import { api } from '../../../../../convex/_generated/api'
import Header from './_components/Header'
import Body from './_components/body/Body'
import ChatInput from './_components/input/ChatInput'

type Props = {
  params: { 
    conversationId: Id<"conversations">;
  }
}

const ConversationById = ({ params: { conversationId } }: Props) => {
  
  const conversation = useQuery(api.conversation.get, { id: conversationId })

  return (
    <ConversationContainer>
      <Header 
        name={conversation?.isGroup ? conversation?.name : conversation?.otherMember?.username ?? ""} 
        imageUrl={conversation?.isGroup ? undefined : conversation?.otherMember?.imageUrl || ''}
      />
      <Body /> 
      <ChatInput />
    </ConversationContainer>
  )
}

export default ConversationById