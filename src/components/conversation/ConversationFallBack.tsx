import React from 'react'
import { Card } from '../ui/card'

type Props = {}

const ConversationFallBack = (props: Props) => {
  return (
   <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
    Select/start a conversation to get started
   </Card>
  )
}

export default ConversationFallBack