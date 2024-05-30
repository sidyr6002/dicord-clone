import React from 'react'

interface ChatHeaderProps {
    serverId: string,
    name: string,
    type: "channel" | "conevrsation",
    imageURL?: string
}

const ChatHeader = ({serverId, name, type, imageURL} : ChatHeaderProps) => {
  return (
    <div className='font-semibold text-md h-9 flex items-center px-3 border-b-2 border-zinc-400 dark:border-neutral-600'>
        ChatHeader
    </div>
  )
}

export default ChatHeader