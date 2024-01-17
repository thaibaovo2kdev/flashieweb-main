'use client'
import ContentWithSidebar from '~/components/layouts/ContentWithSidebar'
import { useMemo } from 'react'

import { FaChalkboardTeacher, FaUser } from 'react-icons/fa'

const TeacherLayout = ({ children }) => {
  const menus = useMemo(
    () => [
      {
        icon: FaUser,
        text: 'Users',
        pathname: '/admin/users',
      },
      // {
      //   icon: PiGameControllerBold,
      //   text: 'Mini Game Management',
      //   pathname: '/teacher/game-management',
      // },
      // {
      //   icon: FaChalkboardTeacher,
      //   text: 'Course Management',
      //   pathname: '/teacher/course-management',
      // },
    ],
    []
  )
  return <ContentWithSidebar toggleMenu={menus}>{children}</ContentWithSidebar>
}

export default TeacherLayout
