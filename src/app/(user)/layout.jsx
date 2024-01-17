'use client'
import ContentWithSidebar from '~/components/layouts/ContentWithSidebar'

import { CgProfile } from 'react-icons/cg'
import {
  MdPassword,
  MdPeopleOutline,
  MdOutlineScoreboard,
} from 'react-icons/md'
import { useMemo } from 'react'

const UserLayout = ({ children }) => {
  const menus = useMemo(
    () => [
      {
        icon: CgProfile,
        text: 'Profile',
        pathname: '/profile',
      },
      {
        icon: MdPassword,
        text: 'Change password',
        pathname: '/change-password',
      },
      {
        icon: MdOutlineScoreboard,
        text: 'Points',
        pathname: '/points',
      },
      {
        icon: MdPeopleOutline,
        text: 'Friends',
        pathname: '/friends',
      },
    ],
    []
  )
  return <ContentWithSidebar toggleMenu={menus}>{children}</ContentWithSidebar>
}

export default UserLayout
