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

import { AiFillHome, AiOutlinePlus } from 'react-icons/ai'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Search from '~/components/Search'
import AddCourseToken from '~/components/AddCourseToken'
import Image from 'next/image'
import constants from '~/utils/constants'

const initMenu = [
  {
    icon: AiFillHome,
    text: 'Home',
    pathname: '/home',
  },
  {
    icon: FaBookmark,
    text: 'Bookmarks',
    pathname: '/bookmarks',
  },
  {
    icon: FaRankingStar,
    text: 'Leaderboard',
    pathname: '/leaderboard',
  },
]

export default function NavbarComponent({
  sidebars = [],
  toggleMenu,
  toggleClass = 'md:hidden',
  menu = initMenu,
}) {
  const path = usePathname()
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

  if (!session?.data?.user?.id) {
    return (
      <Navbar isBordered maxWidth='lg' className='bg-primary'>
        <NavbarContent
          justify='start'
          className='max-w-[70px] md:max-w-[150px]'
        >
          <Image
            src='/img/logo_ic.png'
            width={80}
            height={80}
            className='h-9 w-9 md:hidden'
          />
          <Image
            src='/img/logo.png'
            width={150}
            height={150}
            className='hidden h-14 w-32 md:block'
          />
        </NavbarContent>

        <NavbarContent justify='end'>
          <Link href='/login'>
            <Button>{constants.button_signin}</Button>
          </Link>
          <Link href='/signup'>
            <Button color='success' >{constants.button_signup}</Button>
          </Link>
        </NavbarContent>
      </Navbar>
    )
  }

  return (
    <Navbar isBordered maxWidth='lg' className='bg-primary'>
      <NavbarContent justify='start' className='max-w-[70px] md:max-w-[150px]'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className={`text-white ${toggleClass}`}
        />
        <Link href='/'>
          <Image
            src='/img/logo_ic.png'
            width={80}
            height={80}
            className='h-8 w-8 md:hidden'
          />
          <Image
            src='/img/logo.png'
            width={150}
            height={150}
            className='hidden h-14 w-32 md:block'
          />
        </Link>
      </NavbarContent>
      {Array.isArray(menu) && (
        <NavbarContent justify='center' className='hidden md:flex'>
          {menu.map((i) => {
            const Icon = i.icon
            const selected = path.includes(i.pathname)
            return (
              <NavbarItem key={i.text} className='flex flex-col'>
                <Link
                  href={i.pathname}
                  className='flex h-12 w-16 flex-col  items-center justify-center text-white'
                >
                  <Icon size={18} />
                  <span
                    className={`mt-1 rounded-full px-1 text-[6px] md:text-xs ${
                      selected ? 'bg-white text-blue-400' : ''
                    }`}
                  >
                    {i.text}
                  </span>
                </Link>
              </NavbarItem>
            )
          })}
        </NavbarContent>
      )}
      <NavbarContent>
        <Search>
          <Input
            isDisabled={false}
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
        </Search>
      </NavbarContent>
      <NavbarContent justify='end' className='!flex-grow-0 '>
        <AddCourseToken>
          <Button isIconOnly radius='full' size='sm'>
            <AiOutlinePlus />
          </Button>
        </AddCourseToken>

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
              <p className='font-semibold'>
                Login as {session?.data?.user.role}
              </p>
              <p className='font-semibold'>{session.data?.user?.email}</p>
            </DropdownItem>
            <DropdownItem key='/profile'>Profile</DropdownItem>
            {session?.data?.user?.type === 'teacher' && (
              <DropdownItem key='/teacher/flashset-management'>
                Teacher
              </DropdownItem>
            )}
            {session?.data?.user?.role === 'admin' && (
              <DropdownItem key='/admin/users'>Admin</DropdownItem>
            )}
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

      <NavbarMenu>
        {Array.isArray(menu) &&
          menu.map((item, index) => {
            let active =
              path !== '/'
                ? path == item.pathname
                : path.startsWith(item.pathname)

            return (
              <NavbarMenuItem
                key={`${item.name}-${index}`}
                className=' md:hidden'
              >
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
        <Divider />
        {Array.isArray(toggleMenu) &&
          toggleMenu.map((item, index) => {
            let active =
              path !== '/'
                ? path == item.pathname
                : path.startsWith(item.pathname)

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
    </Navbar>
  )

  return (
    <Navbar isBordered maxWidth='lg' className='bg-primary'>
      <NavbarContent justify='start' className='max-w-[100px] md:max-w-[150px]'>
        {path.startsWith('/teacher') && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className='text-white lg:hidden'
          />
        )}
        {/* {Array.isArray(sidebars) && sidebars?.length > 0 && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className='text-white lg:hidden'
          />
        )} */}

        <Link href='/'>
          <NavbarBrand className='mr-0'>
            <Image
              src='/img/logo_ic.png'
              width={80}
              height={80}
              className='h-9 w-9 md:hidden'
            />
            <Image
              src='/img/logo.png'
              width={150}
              height={150}
              className='hidden h-14 w-32 md:block'
            />
            {/* <Logo size={120} /> */}
            {/* <p className='font-bold text-inherit text-white'>Flashies</p> */}
          </NavbarBrand>
        </Link>
      </NavbarContent>
      <NavbarContent>
        {menu.map((i) => {
          const Icon = i.icon
          const selected =
            i.href === '/' ? path === i.href : path.includes(i.href)

          return (
            <NavbarItem key={i.name} className='flex flex-col justify-around'>
              <Link href={i.href} className='flex flex-col text-white'>
                <Icon size={20} />
                {/* <div className={` h-3 bg-white text-[8px] md:block`}>
                  {i.name}
                </div> */}
                <span
                  className={
                    selected
                      ? 'rounded-full bg-white text-[8px] text-blue-400 md:text-xs'
                      : 'mt-1 text-[8px] md:text-xs'
                  }
                >
                  {i.name}
                </span>
              </Link>
            </NavbarItem>
          )
        })}
      </NavbarContent>
      {/* <NavbarContent>
        {menu.map((i) => {
          const Icon = i.icon
          const selected =
            i.href === '/' ? path === i.href : path.includes(i.href)

          return (
            <NavbarItem key={i.name}>
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
      <NavbarContent>
        <Search>
          <div className='rounded-full bg-white p-2 md:hidden'>
            <FaSearch
              size={18}
              className='text-white-400 pointer-events-none flex-shrink-0 text-black/50 dark:text-white/90'
            />
          </div>
          <Input
            isDisabled={false}
            classNames={{
              base: 'hidden md:flex w-full h-10',
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
        </Search>
      </NavbarContent>

      {session?.data?.user?.id && (
        <NavbarContent justify='end' className='max-w-[80px] sm:max-w-none'>
          <AddCourseToken>
            <Button
              isIconOnly
              radius='full'
              size='sm'
              // className='hidden md:flex'
            >
              <AiOutlinePlus />
            </Button>
          </AddCourseToken>

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
              {session?.data?.user?.type === 'teacher' && (
                <DropdownItem key='/teacher/flashset-management'>
                  Teacher
                </DropdownItem>
              )}
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
      )}

      {!session?.data?.user?.id && (
        <div className='flex flex-row gap-1'>
          <Link href='/login'>
            <Button>Login</Button>
          </Link>
          <Link href='/signup'>
            <Button color='success'>{constants.button_home}</Button>
          </Link>
        </div>
      )}

      {/* <NavbarMenu>
        {sidebars.map((item, index) => (
          <NavbarMenuItem key={`${item.text}-${index}`}>
            <Link
              // color={
              //   index === 2
              //     ? 'primary'
              //     : index === menu.length - 1
              //     ? 'danger'
              //     : 'foreground'
              // }
              className='w-full'
              href={item.pathname}
              size='lg'
            >
              {item.text}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}
      {Array.isArray(sidebars) && (
        <NavbarMenu>
          {sidebars.map((item, index) => {
            let active =
              path !== '/'
                ? path == item.pathname
                : path.startsWith(item.pathname)

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
