import React from 'react'

import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger, 
} from '@/components/ui/sheet'
import { Button } from './ui/button'
import NavigationSidebar from './navigation/navigation-sidebar'
import ServerSideBar from './server/server-sidebar'

interface MobileToggleProps {
    serverId: string
}

const MobileToggle = ({serverId}: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className='md:hidden bg-transparent hover:bg-transparent hover:text-blue-500 transition-colors duration-100'>
            <Menu className='w-5 h-5'/>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className='p-0 h-full flex gap-0 w-fit'>
        <div className='w-16 flex h-full'>
            <NavigationSidebar />
        </div>
        <ServerSideBar serverId={serverId}/>
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle