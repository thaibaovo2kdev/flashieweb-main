'use client'
import Image from 'next/image'
import CardBoxList from '~/components/common/CardBoxList'
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import Link from 'next/link'
import * as flashsetsAPI from '~/apis/flashsets'
import * as coursesAPI from '~/apis/courses'
import * as gamesAPI from '~/apis/games'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Skeleton,
  Spinner,
} from '@nextui-org/react'
import PageLayout from '~/components/layouts/PageLayout'
import { BsCardChecklist } from 'react-icons/bs'
import { alert } from '~/utils/helpers'
import { useSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import Survey from '~/components/Survey'
import constants from '~/utils/constants'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function Page() {
  const [page, setPage] = useState(1)
  const total = useRef(0)
  //   const flashsets = useQuery({
  //     queryKey: ['flashsets', page, 10],
  //     queryFn: () =>
  //       flashsetsAPI.getFlashsets({ page, perPage: 10 }).then((res) => {
  //         return res.data
  //       }),
  //   })

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    ['projects'],
    async ({ pageParam = 1 }) => {
      console.log(pageParam, 'pageParampageParam')
      const res = await flashsetsAPI.getFlashsets({
        page: pageParam,
        perPage: 20,
      })
      total.current = res.total
      return res
    },
    {
      //   getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
      getNextPageParam: (lastPage) => {
        console.log(lastPage.page * 20, lastPage.total)
        // const previousPage = lastPage.info.prev
        //   ? +lastPage.info.prev.split('=')[1]
        //   : 0
        const currentPage = lastPage.page
        if (lastPage.page * 20 >= lastPage.total) return false
        // if (currentPage === lastPage.info.pages) return false
        return currentPage + 1
      },
    }
  )
  console.log(data)
  const loadMore = () => {
    if (flashsets.isLoading) return
    setPage((s) => s + 1)
  }

  if (status === 'loading')
    return <Spinner size='lg' className='mt-8 self-center' />
  if (status === 'error')
    return <Spinner size='lg' color='danger' className='mt-8 self-center' />
  console.log(total.current, 'total.current')
  return (
    <div className='flex flex-col py-4'>
      <h2 className='text-xl'>Flash Sets</h2>
      <InfiniteScroll
        dataLength={total.current} //This is important field to render the next data
        next={() => {
          console.log('nextnextnext')
          fetchNextPage()
        }}
        hasMore={!!hasNextPage}
        loader={<h4>Loading...</h4>}
        //   endMessage={
        //     <p style={{ textAlign: 'center' }}>
        //       <b>Yay! You have seen it all</b>
        //     </p>
        //   }
        //   // below props only if you need pull down functionality
        //   refreshFunction={this.refresh}
        //   pullDownToRefresh
        //   pullDownToRefreshThreshold={50}
        //   pullDownToRefreshContent={
        //     <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        //   }
        //   releaseToRefreshContent={
        //     <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        //   }
      >
        <div
          className={`grid grid-cols-2 gap-4 py-4 md:grid-cols-3 lg:grid-cols-5`}
        >
          {data.pages.map((page) => (
            <React.Fragment key={page.nextId}>
              {page.data.map((i) => (
                <Link
                  key={i.id}
                  href={`/flashsets/${i.id}`}
                  className='cursor-pointer'
                >
                  <Card shadow='sm' className='w-full'>
                    <CardBody className='overflow-visible p-0'>
                      <Image
                        width={320}
                        height={320}
                        //   shadow="sm"
                        //   radius="lg"
                        //   width="100%"
                        alt={i.name}
                        className='aspect-square w-full'
                        src={i.image}
                      />
                    </CardBody>
                    <CardFooter className='justify-between text-small'>
                      <b className='line-clamp-1'>{i.name}</b>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </React.Fragment>
          ))}
          {/* {flashsets?.data?.map((i) => (
          <Link
            key={i.id}
            href={`/flashsets/${i.id}`}
            className='cursor-pointer'
          >
            <Card className='relative overflow-hidden rounded-2xl'>
              <Image
                src={i.image}
                width={320}
                height={320}
                className='aspect-square'
              />
            </Card>
            <p className='mt-2'>{i.name}</p>
          </Link>
        ))} */}
        </div>
      </InfiniteScroll>
    </div>
  )
}
