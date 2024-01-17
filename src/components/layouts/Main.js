'use client'
import React from 'react'
import Navbar from './Navbar'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Spinner } from '@nextui-org/react'

export default function MainLayout({ children }) {
  const session = useSession()
  const pathname = usePathname()
  const nonLayout = ['/login', '/signup', '/reset-password', '/api-doc']
  if (nonLayout.some((i) => pathname.includes(i))) {
    return children
  }

  if (session.status == 'loading') {
    return (
      <div className='flex min-h-screen max-w-[100vw] flex-col items-center justify-center bg-white'>
        <Spinner size='lg' />
      </div>
    )
  }

  return (
    <div className='flex min-h-screen max-w-[100vw] flex-col bg-white'>
      {children}
    </div>
  )
}
