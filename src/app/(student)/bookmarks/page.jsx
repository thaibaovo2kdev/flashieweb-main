'use client'
import Image from 'next/image'
import CardBoxList from '~/components/common/CardBoxList'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import Link from 'next/link'
import * as flashsetsAPI from '~/apis/flashsets'
import * as coursesAPI from '~/apis/courses'
import * as bookmarkAPI from '~/apis/bookmark'
// import ContentWithSidebar from '~/components/layouts/ContentWithSidebar'
import { Button, Card, Skeleton } from '@nextui-org/react'
import PageLayout from '~/components/layouts/PageLayout'
import { BsCardChecklist } from 'react-icons/bs'
import { alert } from '~/utils/helpers'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Home() {
  const flashsets = useQuery({
    queryKey: ['bookmarks', 1, 50],
    queryFn: () => bookmarkAPI.get({ page: 1, perPage: 50 }),
  })

  return (
    <div className='w-full p-1 md:px-4'>
      <CardBoxList
        className={'mt-8 font-semibold'}
        title={'Bookmarks'}
        titleColor={'#D05E5E'}
        // linkMore={'/'}
      >
        <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
          {flashsets?.data?.length === 0 && (
            <p className='my-4'>No data to display</p>
          )}
          {flashsets?.data?.map((i) => (
            <Link
              key={i.data.id}
              href={
                i.type === 'flashset'
                  ? `/flashsets/${i.data.id}`
                  : `/courses/${i.data.id}`
              }
              className='cursor-pointer'
            >
              <Card className='relative overflow-hidden rounded-2xl pb-[95%]'>
                <Image
                  src={i.data.image}
                  width={320}
                  height={320}
                  className='absolute h-full w-full object-cover'
                />
              </Card>
              <p className='mt-2'>{i.data.name}</p>
            </Link>
          ))}
          {flashsets.isLoading && (
            <>
              <Card className='w-full space-y-5 p-4' radius='lg'>
                <Skeleton className='rounded-lg'>
                  <div className='h-24 rounded-lg bg-default-300'></div>
                </Skeleton>
                <div className='space-y-3'>
                  <Skeleton className='w-3/5 rounded-lg'>
                    <div className='h-3 w-3/5 rounded-lg bg-default-200'></div>
                  </Skeleton>
                  <Skeleton className='w-4/5 rounded-lg'>
                    <div className='h-3 w-4/5 rounded-lg bg-default-200'></div>
                  </Skeleton>
                  <Skeleton className='w-2/5 rounded-lg'>
                    <div className='h-3 w-2/5 rounded-lg bg-default-300'></div>
                  </Skeleton>
                </div>
              </Card>
              <Card className='w-full space-y-5 p-4' radius='lg'>
                <Skeleton className='rounded-lg'>
                  <div className='h-24 rounded-lg bg-default-300'></div>
                </Skeleton>
                <div className='space-y-3'>
                  <Skeleton className='w-3/5 rounded-lg'>
                    <div className='h-3 w-3/5 rounded-lg bg-default-200'></div>
                  </Skeleton>
                  <Skeleton className='w-4/5 rounded-lg'>
                    <div className='h-3 w-4/5 rounded-lg bg-default-200'></div>
                  </Skeleton>
                  <Skeleton className='w-2/5 rounded-lg'>
                    <div className='h-3 w-2/5 rounded-lg bg-default-300'></div>
                  </Skeleton>
                </div>
              </Card>
              <Card className='w-full space-y-5 p-4' radius='lg'>
                <Skeleton className='rounded-lg'>
                  <div className='h-24 rounded-lg bg-default-300'></div>
                </Skeleton>
                <div className='space-y-3'>
                  <Skeleton className='w-3/5 rounded-lg'>
                    <div className='h-3 w-3/5 rounded-lg bg-default-200'></div>
                  </Skeleton>
                  <Skeleton className='w-4/5 rounded-lg'>
                    <div className='h-3 w-4/5 rounded-lg bg-default-200'></div>
                  </Skeleton>
                  <Skeleton className='w-2/5 rounded-lg'>
                    <div className='h-3 w-2/5 rounded-lg bg-default-300'></div>
                  </Skeleton>
                </div>
              </Card>
            </>
          )}

          {flashsets.isLoading && flashsets.data?.lenght === 0 && (
            <h1>No data to display</h1>
          )}
        </div>
      </CardBoxList>

      {/* <CardBoxList
        className={'mt-4 font-semibold'}
        title={'Recommend Mini Game'}
        titleColor={'#00BE20'}
        linkMore={'/'}
      >
        <div className='mt-4 grid grid-cols-3 gap-4'>
          {data.map((i, idx) => (
            <div key={idx}>
              <div className='relative overflow-hidden rounded-2xl pb-[95%]'>
                <Image
                  src={i.img}
                  width={320}
                  height={320}
                  className='absolute h-full w-full object-cover'
                />
              </div>
              <p className='mt-2'>{i.title}</p>
            </div>
          ))}
        </div>
      </CardBoxList> */}
    </div>
  )
}
