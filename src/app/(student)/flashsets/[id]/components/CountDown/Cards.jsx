'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import Card from './Card'
import { Button } from '@nextui-org/react'
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6'
import Image from 'next/image'
import constants from '~/utils/constants'
const colors = [
  '#E42100',
  '#F36000',
  '#F3BC00',
  '#A0A226',
  '#349B19',
  '#70BBFF',
  '#7F4877',
  '#BC2A6E',
]
const shuffle = (arr) => {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

const Home = ({ data = [] }) => {
  const imagesOfCard = useRef([])
  const [answers, setAnswers] = useState(new Array(4))
  const [selected, setSelected] = useState(null)
  const [cards, setCards] = useState(
    data.map((i) => ({
      ...i,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  )

  const [index, setIndex] = useState(0)
  console.log('imagesOfCard', imagesOfCard.current)
  // console.log(first)
  useEffect(() => {
    if (index > -1) {
      const randomImgs = shuffle(imagesOfCard.current).filter(
        (i) => i != data?.[index]?.backImage
      )

      const answersTemp = randomImgs.slice(0, 3)
      answersTemp.push(data?.[index]?.backImage)
      setAnswers(shuffle(answersTemp))
    }
  }, [index])

  useEffect(() => {
    imagesOfCard.current = data?.reduce((p, n) => {
      if (n.frontImage?.length > 0 && n.backImage?.length > 0) {
        p.push(n.frontImage, n.backImage)
      }
      if (n.frontImage?.length > 0) {
        p.push(n.frontImage)
      }
      if (n.backImage?.length > 0) {
        p.push(n.frontImage)
      }
      return [...p]
    }, [])
  }, [data])

  const removeCard = (oldCard, swipe) => {
    if (swipe === 'nope') {
      setIndex((s) => s - 1)
    } else {
      setIndex((s) => s + 1)
    }
  }

  const handleNext = () => {
    setIndex((s) => Math.min(s + 1, data.length))
  }
  const handlePrev = () => {
    setIndex((s) => Math.max(s - 1, 0))
  }
  const onClickSelected = (idx) => () => {
    setSelected(idx)
  }
  return (
    <div className='flex flex-col'>
      <div className='gradient relative flex h-[60vh] w-full flex-col items-center justify-center rounded-md bg-slate-800'>
        {cards.length - index > 1 ? (
          <AnimatePresence>
            <Card active={true} removeCard={removeCard} data={cards[index]} />
          </AnimatePresence>
        ) : (
          <span className='text-xl text-white'>{constants.quiz_finished}</span>
        )}
      </div>
      <div className='mt-4 grid grid-cols-4 border-x-2 border-y-4'>
        {answers?.map((i, idx) => (
          <div
            key={`${i}${idx}`}
            className='flex cursor-pointer flex-col items-center justify-center overflow-hidden border-x-2'
            style={{
              backgroundColor: selected === idx ? '#70BBFF' : '#f1f5f9',
            }}
            onClick={onClickSelected(idx)}
          >
            <Image width={100} height={100} src={i} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
