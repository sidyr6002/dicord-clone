import React from 'react'
import MobileToggle from '@/components/mobile-toggle'

import { Hash } from 'lucide-react'

interface ChatHeaderProps {
    serverId: string,
    name: string,
    type: "channel" | "conevrsation",
    imageURL?: string
}

const ChatHeader = ({serverId, name, type, imageURL} : ChatHeaderProps) => {
  return (
    <div className='font-semibold text-md h-9 flex items-center md:px-3 border-b-2 border-zinc-600/90 dark:border-stone-950/60'>
        <MobileToggle serverId={serverId}/>
        {
            type === "channel" &&
            <Hash className='w-4 h-4 text-zinc-500/90 dark:text-zinc-300/60 mr-2' />
        }
        <p className='font-semibold text-md text-stone-900 dark:text-stone-200'>{name}</p>
    </div>
  )
}

export default ChatHeader