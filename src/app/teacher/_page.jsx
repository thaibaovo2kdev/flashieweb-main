'use client'
import { LuListChecks } from 'react-icons/lu'
import { PiCardsFill } from 'react-icons/pi'
import { GiGamepadCross } from 'react-icons/gi'
import Link from 'next/link'
export default function Page() {
  return (
    <div className='w-screen-sm flex flex-col gap-4 self-center'>
      <div className='rounded-full border-2 border-[#1D365D] bg-[#FCC27C] px-4 py-2 text-lg font-semibold'>
        Teacher System
      </div>

      <Link href='/teacher/flashset-management'>
        <div className='flex cursor-pointer flex-row items-center gap-2'>
          <PiCardsFill size={22} color='#1D365D' />
          <p className='text-lg font-semibold'>Flash set Management</p>
        </div>
      </Link>
      <Link href='/teacher/game-management'>
        <div className='flex cursor-pointer flex-row items-center gap-2'>
          <GiGamepadCross
            className='rounded-full bg-[#1D365D] p-1'
            size={22}
            color='#fff'
          />
          <p className='text-lg font-semibold'>Mini game Management</p>
        </div>
      </Link>
      <Link href='/teacher/course-management'>
        <div className='flex cursor-pointer flex-row items-center gap-2'>
          <LuListChecks
            className='rounded-md bg-[#1D365D] p-1'
            size={22}
            color='#fff'
          />
          <p className='text-lg font-semibold'>Course Management</p>
        </div>
      </Link>
    </div>
  )
}
