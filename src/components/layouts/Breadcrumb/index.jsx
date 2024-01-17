import React from 'react'
import Link from 'next/link'
import { usePathname, useParams, useSearchParams } from 'next/navigation'

const BreadCrumbs = ({}) => {
  const paths = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const paramValues = Object.values(params)

  const pathNames = paths.split('/').filter((path) => path)
  const breadCrumbs = pathNames.map((link, index) => {
    const url = `/${pathNames.slice(0, index + 1).join('/')}`
    return { name: link[0].toUpperCase() + link.slice(1, link.length), url }
  })
  const noIdPaths = pathNames.filter((p) => !paramValues.includes(p))
  // && !paramValues.includes(path)
  const title =
    paths.includes('/edit') && !id ? 'Create' : noIdPaths[noIdPaths.length - 1]
  return (
    <section className='mb-4'>
      <div className='container mx-auto max-w-screen-xl pr-4'>
        <h1 className='text-2xl font-semibold'>
          {`${title[0].toUpperCase() + title.slice(1, title.length)}`.replace(
            /-/g,
            ' '
          )}
        </h1>
        <ol className='inline-flex flex-wrap items-center space-x-1 text-gray-600 md:space-x-2'>
          {(noIdPaths.length > 1 ? breadCrumbs : [])?.map(
            (breadCrumb, index) => {
              if (paramValues.includes(breadCrumb.name)) return null
              return (
                <li key={breadCrumb.name} className='inline-flex items-center'>
                  {index > 0 && (
                    <span className='mr-1 text-gray-400 md:mr-2'>/</span>
                  )}
                  <Link
                    href={breadCrumb.url}
                    className='text-md font-semibold text-gray-600 hover:text-primary'
                  >
                    {breadCrumb.name}
                  </Link>
                </li>
              )
            }
          )}
        </ol>
      </div>
    </section>
  )
}

export default BreadCrumbs
