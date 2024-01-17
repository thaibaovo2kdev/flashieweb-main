'use client'
import React, { useEffect, memo, useState, useCallback, useRef } from 'react'

import Image from 'next/image'
import CardBoxList from '~/components/common/CardBoxList'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ReactCardFlip from 'react-card-flip'
import Link from 'next/link'
import * as gamesAPI from '~/apis/games'
import * as coursesAPI from '~/apis/courses'
// import ContentWithSidebar from '~/components/layouts/ContentWithSidebar'
import { Button, Card, Skeleton } from '@nextui-org/react'
import PageLayout from '~/components/layouts/PageLayout'
import { BsCardChecklist, BsFillImageFill } from 'react-icons/bs'
import { alert } from '~/utils/helpers'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { IoIosArrowBack } from 'react-icons/io'
import useSound from 'use-sound'

const shuffle = (arr) => {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
const colors = [
  '#E42100',
  '#03d7a4',
  '#F3BC00',
  '#6a12e5',
  '#349B19',
  '#70BBFF',
  '#7F4877',
  '#BC2A6E',
  '#222222',
  '#8c40fc',
  '#F36000',
  '#A0A226',
  '#0570b7',
  '#01b5bf',
]

export default function Scene() {
  const { id, sceneId } = useParams()
  const [playFlipcard] = useSound('/sound/flipcard.mp3')
  const [playSuccess] = useSound('/sound/success.mp3')
  const [playWrong] = useSound('/sound/wrong.mp3')

  const [cards, setCard] = useState([])
  const [result, setResult] = useState([])
  const [selected, setSelected] = useState([])

  const scenecards = useQuery({
    queryKey: ['scene-cards', id, sceneId],
    queryFn: () => gamesAPI.cardsOfScene(id, sceneId),
  })

  useEffect(() => {
    if (scenecards.data?.length > 0 && cards.length === 0) {
      const _cards = scenecards.data.map((i, idx) => ({
        ...i,
        color: colors[idx],
      }))
      setCard(shuffle([..._cards, ..._cards]))
    }
  }, [scenecards])

  useEffect(() => {
    if (selected.length > 1) {
      if (cards[selected[0]].id === cards[selected[1]].id) {
        playSuccess()
        setResult((s) => [...s, cards[selected[0]].id])
        setSelected([])
      } else {
        playWrong()
        setTimeout(() => {
          setSelected([])
        }, 1000)
      }
    }
  }, [selected])

  if (scenecards.isLoading) {
    return (
      <div className='flex flex-col'>
        <div className='flex flex-row justify-between'>
          <Link href='/'>
            <IoIosArrowBack size={24} />
          </Link>
          <p>Game</p>
          <div className='w-6' />
        </div>
        <div className='mt-4 grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5'>
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between'>
        <Link href='/'>
          <IoIosArrowBack size={24} />
        </Link>
        <p>Game</p>
        <div className='w-6' />
      </div>
      <div className={`mt-4 grid grid-cols-${cards.length / 2} gap-4`}>
        {cards?.map?.((i, idx) => (
          <Item
            key={i.id}
            data={i}
            onSelect={() => {
              setSelected((s) => {
                if (s.length >= 2) return s
                playFlipcard()
                return [...s, idx]
              })
            }}
            selected={selected.includes(idx) || result.includes(i.id)}
          />
        ))}
      </div>
    </div>
  )
}
const Item = React.memo(
  ({ data, selected, onSelect }) => {
    return (
      <ReactCardFlip
        containerClassName='h-full w-full'
        isFlipped={selected}
        flipDirection='horizontal'
      >
        <div
          className={`cursor-pointer`}
          onClick={() => {
            onSelect(data)
          }}
        >
          <Card className='relative flex flex-row items-center justify-center overflow-hidden rounded-2xl bg-[#c2cfd9] pb-[95%]'>
            <BsFillImageFill
              size={50}
              color='gray'
              className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'
            />
          </Card>
        </div>
        <div
          className={`cursor-pointer rounded-2xl border-2`}
          style={{ borderColor: `${data.color}` }}
          onClick={() => {
            onSelect(data)
          }}
        >
          <Card className='relative overflow-hidden rounded-2xl pb-[95%]'>
            <Image
              src={data.frontImage || data.backImage}
              width={320}
              height={320}
              className='absolute h-full w-full object-cover'
            />
          </Card>
        </div>
      </ReactCardFlip>
    )
  },
  (p, n) =>
    JSON.stringify(p.data) === JSON.stringify(n.data) &&
    p.selected === n.selected
)
