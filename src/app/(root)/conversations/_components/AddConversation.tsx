import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'
import {useMutationState} from "@/hooks/useMutationState";
type Props = {}

const AddConversation = (props: Props) => {
    const friends = useQuery(api.friends.get)
    const {mutate:createConversation,pending} = useMutationState(api.conversation.create)

  return (
    <Dialog>
  <DialogTrigger><Button variant="default" className='px-6'>Add</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      {friends && friends.length > 0 && (
      <DialogTitle>Select a friend to start conversation with!</DialogTitle>
      )}
    </DialogHeader>

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
          <Button onClick={() => createConversation({id: friend?._id})} className="py-1 px-6">Add</Button>
        </div>
      </div>
    ))
  )) : <p className='text-xl text-white text-center my-4 font-semibold
  '>No friends found</p>
}

  </DialogContent>
    </Dialog>
  )
}

export default AddConversation