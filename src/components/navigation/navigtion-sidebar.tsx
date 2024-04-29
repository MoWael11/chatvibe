import { NavigationItem } from '@/components/navigation/navigation-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ModeToggle } from '../mode-toggle'
import { NavitionAction } from './navigation-action'
import { signOut } from 'auth'
import { LogOut } from 'lucide-react'

export const NavigationSidebar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  const servers = await db.server.findMany({
    where: {
      members: { some: { profileId: profile.id } },
    },
  })

  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#e3d5d8] dark:bg-[#1E1F22] py-3'>
      <NavitionAction />
      <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
      <ScrollArea className='flex-1 w-full'>
        {servers.map((server) => (
          <div className='mb-4' key={server.id}>
            <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
          </div>
        ))}
      </ScrollArea>
      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
        <ModeToggle />
        <form
          action={async () => {
            'use server'
            await signOut()
          }}
        >
          <button type='submit' className='group flex items-center'>
            <div className='flex mx-3 h-[48px] w-[48px] rounded-[6px] transition-all items-center justify-center bg-background dark:bg-neutral-800 group-hover:bg-neutral-700'>
              <LogOut className='text-white transition' size={25} />
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}
