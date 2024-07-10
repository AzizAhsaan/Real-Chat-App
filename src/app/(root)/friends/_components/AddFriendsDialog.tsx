'use client'
import React from 'react'
import z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMutationState } from '@/hooks/useMutationState'
import { api } from '../../../../../convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
type Props = {}
const addFriendFormSchema = z.object({
    email:z.string().email({message:"Invalid email"})
})

const AddFriendsDialog = (props: Props) => {
    const {mutate:createRequest,pending} = useMutationState(api.request.create)
    const form  = useForm({
        resolver:zodResolver(addFriendFormSchema),
        defaultValues:{
            email:"",
        }
    })

    const handleSubmit = async (values:any) => {
        await  createRequest({email:values.email}).then(() => {
            form.reset()
            toast.success("Friend request sent")
        }).catch(error => {
            console.log(error)
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occured")
        })
    }
  return (
    <Dialog>
        <Tooltip>
            <TooltipTrigger>
                <Button size="icon" variant="outline">
                    <DialogTrigger>
                        <UserPlus />
                        </DialogTrigger>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add friend</p>
            </TooltipContent>
        </Tooltip>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add friend</DialogTitle>
                <DialogDescription>Send a request to connect with your friends</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
<FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          type='text'
                          {...field}
                          value={field.value ?? ""}
                        />
                        
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                    <DialogFooter>
                        <Button disabled={pending} type='submit'>Send</Button>
                    </DialogFooter>

                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default AddFriendsDialog