'use client'
import { memo } from 'react'
// import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from './components/Sidebar'

const AdminContent = ({ children, title, menu }) => {
  const pathname = usePathname()
  // const router = useRouter()
  let _title = title
  if (Array.isArray(menu) && !_title) {
    menu.forEach((m) => {
      console.log(m, pathname.includes(m.pathname))
      if (pathname.includes(m.pathname)) _title = m.text
    })
  }
  // if (pathname.includes('/editor/new')) {
  //   title = 'Add a new course'
  // } else if (pathname.includes('/editor/')) {
  //   title = 'Edit'
  // } else if (pathname.includes('/courses/')) {
  //   title = 'Students'
  // }

  return (
    <div className='flex w-full flex-row'>
      <Sidebar menu={menu} />
      <div className='flex flex-1 flex-col p-4'>
        {_title?.length > 0 && (
          <h1 className='mb-3 text-2xl font-semibold'>{_title}</h1>
        )}
        {children}
      </div>
    </div>
  )
}

export default AdminContent
