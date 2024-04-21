import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='h-full flex justify-center items-center bg-blue-500/80'>{children}</div>
  )
}

export default layout