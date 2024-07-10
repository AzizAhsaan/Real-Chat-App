'use client'
import Itemlist from '@/components/shared/item-list/Itemlist'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import DMConversationitem from './_components/DMConversationitem'
import { X } from 'lucide-react'
import AddConversation from './_components/AddConversation'

type Props = React.PropsWithChildren<{}>
const ConversationLayout = ({children}: Props) => {
  const conversations = useQuery(api.conversations.get)
  return (
    <>
    <Itemlist action={<AddConversation />} title='Conversation'>
      {conversations ?
      conversations?.length === 0 ? <p className='size-full flex items-center justify-center'>No conversations found</p> :
      conversations.map(conversations => {
        return conversations.conversation.isGroup ? null :
        <DMConversationitem key={conversations.conversation._id} id={conversations?.conversation?._id} username={conversations?.otherMember?.username || ""} imageUrl={conversations?.otherMember?.imageUrl || ""}  />
      })
       : null}
    </Itemlist>
    {children}
    </>
  )
}

export default ConversationLayout