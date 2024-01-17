'use client'
import React, { useRef, useState } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Avatar,
  Divider,
} from '@nextui-org/react'
import { FaUser, FaSearch } from 'react-icons/fa'
import { FaRankingStar, FaBookmark } from 'react-icons/fa6'
import { Logo } from '~/assets/icon'

import { AiFillHome } from 'react-icons/ai'
import { BsFillBoxFill } from 'react-icons/bs'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function NavbarComponent({ menu }) {
  const pathname = usePathname()

  const session = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const onDropdown = (key) => {
    if (key === 'logout') signOut()
    else {
      console.log(key)
      router.push(key)
    }
  }
  return (
    <Navbar isBordered maxWidth='2xl' className='bg-primary'>
      <NavbarContent justify='start' className='max-w-[120px] sm:max-w-[16rem]'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className='text-white lg:hidden'
        />
        <Link href='/'>
          <NavbarBrand className='mr-4'>
            <Logo size={120} />
            {/* <p className='font-bold text-inherit text-white'>Flashie</p> */}
          </NavbarBrand>
        </Link>
      </NavbarContent>
      {/* <NavbarContent className='hidden sm:flex'>
        {menu.map((i) => {
          const Icon = i.icon
          const selected =
            i.href === '/' ? path === i.href : path.includes(i.href)

          return (
            <NavbarItem key={i.name} className='hidden sm:flex'>
              <Link href={i.href} className='flex flex-col text-xs text-white'>
                <Icon size={20} />
                <p
                  className={
                    selected
                      ? 'mt-1 rounded-full bg-white px-1 text-blue-400'
                      : ''
                  }
                >
                  {i.name}
                </p>
              </Link>
            </NavbarItem>
          )
        })}
      </NavbarContent> */}
      <NavbarContent className='hidden md:flex'>
        <Input
          classNames={{
            base: 'w-full h-10',
            mainWrapper: 'h-full',
            input: [
              'bg-transparent',
              'text-black/90',
              'placeholder:text-default-700/50',
            ],
            inputWrapper: 'h-full font-normal text-white ',
          }}
          placeholder='Type to search...'
          size='sm'
          startContent={
            <FaSearch
              size={18}
              className='text-white-400 pointer-events-none flex-shrink-0 text-black/50 dark:text-white/90'
            />
          }
          type='search'
        />
      </NavbarContent>

      <NavbarContent justify='end' className='max-w-[80px] sm:max-w-none'>
        <Dropdown placement='bottom-end'>
          <DropdownTrigger>
            <Avatar
              isBordered
              as='button'
              className='transition-transform'
              color='secondary'
              name='Jason Hughes'
              size='sm'
              src={session.data?.user?.avatar}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label='Profile Actions'
            variant='flat'
            onAction={onDropdown}
          >
            <DropdownItem
              key='/profile'
              className='h-14 gap-2 rounded-none border-b-1'
            >
              <p className='font-semibold'>Signed in as</p>
              <p className='font-semibold'>{session.data?.user?.email}</p>
            </DropdownItem>
            <DropdownItem key='/profile'>Profile</DropdownItem>
            <DropdownItem key='/teacher'>Teacher</DropdownItem>
            {/* <DropdownItem key='/flashset-management'>
              Flashset management
            </DropdownItem> */}
            {/* 
            <DropdownItem key='configurations'>Configurations</DropdownItem>
            <DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem> */}
            <DropdownItem
              key='logout'
              color='danger'
              className='rounded-none border-t-1'
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {Array.isArray(menu) && (
        <NavbarMenu>
          {menu.map((item, index) => {
            let active =
              pathname !== '/'
                ? pathname == item.pathname
                : pathname.startsWith(item.pathname)

            return (
              <NavbarMenuItem key={`${item.name}-${index}`}>
                <Link
                  color={active ? 'primary' : 'foreground'}
                  className='mt-4 w-full gap-4'
                  href={item.pathname}
                  size='lg'
                >
                  <item.icon size={28} />
                  {item.text}
                </Link>
              </NavbarMenuItem>
            )
          })}
        </NavbarMenu>
      )}
    </Navbar>
  )
}
