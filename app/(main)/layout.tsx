import React from 'react'

import NavigationSidebar from '@/components/navigation/navigation-sidebar'

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='h-full'>
        <div className='min-h-screen fixed w-16 hidden md:flex z-30'>
            <NavigationSidebar />
        </div>
        <main className='h-full md:pl-16'>
            {children}
        </main>
    </div>
  )
}

export default MainLayout