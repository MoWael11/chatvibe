import { Smile } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useTheme } from 'next-themes'

interface EmojiPickerProps {
  onChange: (value: string) => void
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className='text-zinc dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300' />
      </PopoverTrigger>
      <PopoverContent
        side='right'
        sideOffset={40}
        className='bg-transparent shadow-none border-none shadow-non drop-shadow-none mb-16'
      >
        <Picker data={data} theme={resolvedTheme} onEmojiSelect={(emoji: any) => onChange(emoji.native)} />
      </PopoverContent>
    </Popover>
  )
}
