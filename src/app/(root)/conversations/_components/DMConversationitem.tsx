'use client'
import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '../../../../../convex/_generated/api';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';
import {  useRouter } from 'next/navigation';
type Props = {
    id:Id<"conversations">,
    imageUrl:string;
    username:string
}
const DMConversationitem = ({id,imageUrl,username}: Props) => {
    const router = useRouter()
    const {mutate:deleteConversation,pending} = useMutationState(api.conversation.deleteConversation)
    const DeleteConversation = () => {
        try{
            deleteConversation({id})
            toast.success("Deleted conversation successfully")
            router.push("/conversations")
        }catch(error){
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred")
        }
    }
    
  return (
        <Card className="p-2 flex flex-row items-center gap-4 truncate">
                <Link href={`/conversations/${id}`} className='w-full'>

            <div className='flex flex-row items-center gap-4 truncate'>
                <Avatar>
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>

                <div className='flex flex-col truncate'>
                    <h4 className='truncate'>{username}</h4>
                    <p className='text-sm text-muted-foreground truncate'>Start the conversation</p>
                </div>

            </div>
            </Link>
            <Button disabled={pending} variant="destructive" onClick={DeleteConversation}>Delete</Button>
        </Card>

  )
}

export default DMConversationitem