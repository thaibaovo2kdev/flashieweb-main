'use client'

import { usePathname, useRouter } from 'next/navigation'
import { PiGameControllerBold } from 'react-icons/pi'
import { MdOutlineReceipt } from 'react-icons/md'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { TbCardsFilled } from 'react-icons/tb'

import { useSession } from 'next-auth/react'

const menus = [
  {
    icon: FaChalkboardTeacher,
    text: 'Courses',
    pathname: '/course-management',
  },
  {
    icon: TbCardsFilled,
    text: 'Flash Sets',
    pathname: '/flashset-management',
  },
  {
    icon: PiGameControllerBold,
    text: 'Mini Games',
    pathname: '/games',
  },
]

const Sidebar = ({ menu = menus }) => {
  const pathname = usePathname()
  const router = useRouter()
  // const { data: session } = useSession()

  const handleItemClick = (item) => {
    router.push(item.pathname)
  }

  return (
    <div
      className={`sticky top-16 hidden h-[calc(100vh-4rem)] w-12 bg-white p-1 duration-300 dark:bg-zinc-800 md:block md:w-56 md:p-4 lg:w-64`}
    >
      {menu.map((item) => (
        <div
          key={item.text}
          className={`my-2 flex flex-row items-center space-x-2 p-2 hover:bg-primary-300 dark:hover:bg-zinc-700 md:p-4 ${
            pathname.includes(item.pathname) &&
            'bg-primary text-white hover:bg-primary-400 dark:hover:bg-zinc-600'
          } cursor-pointer rounded-lg `}
          onClick={() => handleItemClick(item)}
        >
          <item.icon size={28} />
          <span className={`hidden text-xs md:block lg:text-base`}>
            {item.text}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Sidebar
