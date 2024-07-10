'use client'
import ConversationFallBack from '@/components/conversation/ConversationFallBack'
import Itemlist from '@/components/shared/item-list/Itemlist'
import React from 'react'
import AddFriendsDialog from './_components/AddFriendsDialog'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Loader2, User } from 'lucide-react'
import Request from './_components/Request'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { deleteConversation } from '../../../../convex/conversation'
import { useMutationState } from '@/hooks/useMutationState'

type Props = {}

const FriendsPage = (props: Props) => {
  const requests = useQuery(api.requests.get)
  const friends = useQuery(api.friends.GetAllFriends)
  const {mutate:deleteFriend,pending} = useMutationState(api.friends.deleteFriend)

  console.log(friends,"friends")
  return (
    <>
      <Itemlist title='Friends' action={<AddFriendsDialog />}>
      <div className='min-h-[100px] my-3 w-full'>
      {requests ? requests.length === 0 ? <p className='size-full flex items-center justify-center'>No friend requests found</p> : requests.map((request) => {return <Request key={request.request._id} id={request.request._id} imageUrl={request.sender.imageUrl} username={request.sender.username} email={request.sender.email} />}) : <div className='flex items-center justify-center w-full '><Loader2 className="h-8 w-8" /></div>}
      </div>

      <div className='flex flex-col min-h-[calc(100%-100px)] w-full'>
      {friends && friends.length > 0 ?
  friends.map(friendlist => (
    friendlist?.friendDetails.map((friend: any) => (
      <div key={friend} className="flex flex-row items-center justify-between">
        <Avatar>
          <AvatarImage src={friend?.imageUrl} />
          <AvatarFallback>
            <User /> 
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-row items-center gap-3">
          <p className="text-lg">{friend?.username}</p>
          <Button onClick={() => deleteFriend({id: friend?._id})} variant="destructive" className="py-1 px-6">Delete</Button>
        </div>
      </div>
    ))
  )) : <p className='text-xl text-white text-center my-4 font-semibold
  '>No friends found</p>
}
      </div>
      </Itemlist>
      <ConversationFallBack />
      </>
  )
}

export default FriendsPage