// 'use client'
// import PageLayout from '~/components/layouts/PageLayout'
// // import { useMemo } from 'react'

// // import { PiGameControllerBold } from 'react-icons/pi'
// // import { FaChalkboardTeacher } from 'react-icons/fa'
// // import { TbCardsFilled } from 'react-icons/tb'

// const TeacherLayout = ({ children }) => {
//   // const menus = useMemo(
//   //   () => [
//   //     {
//   //       icon: TbCardsFilled,
//   //       text: 'Flash Set Management',
//   //       pathname: '/flashset-management',
//   //     },
//   //     {
//   //       icon: PiGameControllerBold,
//   //       text: 'Mini Game Management',
//   //       pathname: '/game-management',
//   //     },
//   //     {
//   //       icon: FaChalkboardTeacher,
//   //       text: 'Course Management',
//   //       pathname: '/course-management',
//   //     },
//   //   ],
//   //   []
//   // )
//   return <PageLayout>{children}</PageLayout>
// }

// export default TeacherLayout
'use client'
import ContentWithSidebar from '~/components/layouts/ContentWithSidebar'
import { useMemo } from 'react'

import { PiGameControllerBold } from 'react-icons/pi'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { TbCardsFilled } from 'react-icons/tb'

const TeacherLayout = ({ children }) => {
  const menus = useMemo(
    () => [
      {
        icon: TbCardsFilled,
        text: 'Flash Set Management',
        pathname: '/teacher/flashset-management',
      },
      {
        icon: PiGameControllerBold,
        text: 'Mini Game Management',
        pathname: '/teacher/game-management',
      },
      {
        icon: FaChalkboardTeacher,
        text: 'Course Management',
        pathname: '/teacher/course-management',
      },
    ],
    []
  )
  return <ContentWithSidebar toggleMenu={menus}>{children}</ContentWithSidebar>
}

export default TeacherLayout
