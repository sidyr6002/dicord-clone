import { Hash } from 'lucide-react'
import React from 'react'


interface ChatWelcomeProps {
    name: string
    type: "channel" | "conversation"
}

const ChatWelcome = ({name, type}: ChatWelcomeProps) => {
  return (
    <div className='px-5 mb-4 space-y-2'>
        {type === "channel" && (
            <div className='w-24 h-24 flex items-center justify-center rounded-full bg-zinc-400/30 dark:bg-zinc-700/40'>
                <Hash className='w-14 h-14 text-stone-700/80 dark:text-stone-300/80' />
            </div>
        )}
        <p className='text-xl md:text-2xl font-semibold'>
            {type === "channel" ? `Welcome to #${name}!` : `Welcome to ${name}'s chat!`}
        </p>
        <p className='text-sm text-zinc-400 dark:text-stone-500/80'>
            {type === "channel" ? "Start by sending a message in this channel." : "Start by sending a message in this conversation."}
        </p>
    </div>
  )
}

export default ChatWelcome