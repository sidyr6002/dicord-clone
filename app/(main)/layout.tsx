import NavigationSidebar from '@/components/navigation/navigation-sidebar'
import React from 'react'

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='h-full'>
        <div className='min-h-screen w-16 hidden md:flex fixed z-30'>
            <NavigationSidebar />
        </div>
        <main className='h-full md:pl-20'>
            {children}
        </main>
    </div>
  )
}

export default MainLayout