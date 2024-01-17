'use client'
import { Button } from '@nextui-org/react'
import Navbar from '../Navbar'
import { AiOutlineLeft } from 'react-icons/ai'
import { useParams, usePathname, useRouter } from 'next/navigation'

export default function PageLayout({
  children,
  title,
  hideNavigator = false,
  menu,
  sidebars,
  toggleMenu,
}) {
  const router = useRouter()
  const paths = usePathname()
  const params = useParams()
  const paramValues = Object.values(params)

  const pathNames = paths.split('/').filter((path) => path)
  // const breadCrumbs = pathNames.map((link, index) => {
  //   const url = `/${pathNames.slice(0, index + 1).join('/')}`
  //   return { name: link[0].toUpperCase() + link.slice(1, link.length), url }
  // })
  const noIdPaths = pathNames.filter((p) => !paramValues.includes(p))
  const _title = noIdPaths[noIdPaths.length - 1]

  return (
    <>
      <Navbar menu={menu} sidebars={sidebars} toggleMenu={toggleMenu} />
      <div className='flex w-full max-w-5xl flex-col self-center px-4'>
        {!hideNavigator && (
          <div className='relative my-4 flex flex-row'>
            <div className='absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center text-xl font-semibold'>
              {`${
                title ||
                _title[0].toUpperCase() + _title.slice(1, _title.length)
              }`.replace(/-/g, ' ')}
            </div>
            <Button
              isIconOnly
              variant='light'
              onPress={() => {
                //   console.log(window.history, pathNames)
                // window?.history?.back?.()
                router.back()
              }}
            >
              <AiOutlineLeft size={24} />
            </Button>
          </div>
        )}
        {children}
      </div>
    </>
  )
}
