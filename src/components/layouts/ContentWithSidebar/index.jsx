'use client'
import { memo } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from '../Navbar'

const ContentWithSidebar = ({ children, toggleMenu, menu }) => {
  return (
    <>
      <Navbar toggleMenu={toggleMenu} toggleClass='lg:hidden' />
      <div className='mx-[auto] w-full max-w-5xl'>
        <div className='flex w-full flex-row'>
          {Array.isArray(menu || toggleMenu) && (
            <Sidebar menu={menu || toggleMenu} />
          )}

          <div className='flex flex-1 flex-col p-4'>{children}</div>
        </div>
      </div>
    </>
  )
}

export default memo(ContentWithSidebar)
