'use client'
import Image from 'next/image'
import CardBoxList from '~/components/common/CardBoxList'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import Link from 'next/link'
import * as flashsetsAPI from '~/apis/flashsets'
import * as coursesAPI from '~/apis/courses'
// import ContentWithSidebar from '~/components/layouts/ContentWithSidebar'
import { Button, Card, Skeleton } from '@nextui-org/react'
import PageLayout from '~/components/layouts/PageLayout'
import { BsCardChecklist } from 'react-icons/bs'
import { alert } from '~/utils/helpers'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function MiniGame() {
  const data = [
    {
      img: '/img/img1.png',
      title: 'Game 01',
    },
    {
      img: '/img/img2.png',
      title: 'Game 02',
    },
    {
      img: '/img/img3.png',
      title: 'Game 03',
    },
    {
      img: '/img/img3.png',
      title: 'Game 04',
    },
  ]

  return (
    <div className='w-full p-1 md:px-4'>
      <CardBoxList
        className={'mt-8 font-semibold'}
        title={'Game of Month'}
        titleColor={'#D05E5E'}
        linkMore={'/'}
      >
        <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
          {data?.map((i) => (
            <Link
              key={i.id}
              href={`/flashsets/${i.id}`}
              className='cursor-pointer'
            >
              <Card className='relative overflow-hidden rounded-2xl pb-[95%]'>
                <Image
                  src={i.img}
                  width={320}
                  height={320}
                  className='absolute h-full w-full object-cover'
                />
              </Card>
              <p className='mt-2'>{i.title}</p>
            </Link>
          ))}
          {data.isLoading && (
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
        </div>
      </CardBoxList>
      <CardBoxList
        className={'mt-8 font-semibold'}
        title={'Best Game'}
        titleColor={'#D05E5E'}
        linkMore={'/'}
      >
        <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
          {data?.map((i) => (
            <Link
              key={i.id}
              href={`/flashsets/${i.id}`}
              className='cursor-pointer'
            >
              <Card className='relative overflow-hidden rounded-2xl pb-[95%]'>
                <Image
                  src={i.img}
                  width={320}
                  height={320}
                  className='absolute h-full w-full object-cover'
                />
              </Card>
              <p className='mt-2'>{i.title}</p>
            </Link>
          ))}
          {data.isLoading && (
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
        </div>
      </CardBoxList>
    </div>
  )
}
