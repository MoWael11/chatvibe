'use client'

import { LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface UserActivationProps {
  email: string | undefined
  imageUrl: string
  name: string
}

export const UserAccountNav = ({ email, imageUrl, name }: UserActivationProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='overflow-visible' asChild>
        <Button className='right-full h-8 w-8 rounded-full aspect-square bg-slate-400'>
          <Avatar className='relative w-8 h-8'>
            {imageUrl ? (
              <div className='relative aspect-square h-full w-full'>
                <Image fill src={imageUrl} alt='profile picture' referrerPolicy='no-referrer' />
              </div>
            ) : (
              <AvatarFallback>
                <span className='sr-only'>{name}</span>
                {<User className='h-4 w-4 text-zinc-900' />}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' side='right'>
        <div className='felx items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            {name && <p className='font-medium text-sm '>{name}</p>}
            {email && <p className='w-[200px] truncate text-xs '>{email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
