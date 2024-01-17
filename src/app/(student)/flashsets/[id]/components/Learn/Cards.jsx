'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import Card from './Card'
import { Button } from '@nextui-org/react'
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6'
import * as flashsetAPI from '~/apis/flashsets'
import { useQueryClient } from '@tanstack/react-query'
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

const Cards = ({ data = [], flashsetId, onClose }) => {
  const queryClient = useQueryClient()

  const [cards, setCards] = useState(
    data.map((i) => ({
      ...i,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  )

  const [index, setIndex] = useState(0)

  const handleNext = () => {
    setIndex((s) => Math.min(s + 1, data.length))
  }
  const handlePrev = () => {
    setIndex((s) => Math.max(s - 1, 0))
  }

  const handleFlip = (flashcardId) => () => {
    flashsetAPI.learn(flashsetId, [flashcardId]).then(() => {
      queryClient.refetchQueries(['flashset', flashsetId])
    })
  }

  return (
    <div className='flex flex-col'>
      <div className='gradient relative flex h-[60vh] w-full flex-col items-center justify-center rounded-md bg-slate-800'>
        {cards.length - index >= 1 ? (
          <AnimatePresence>
            {cards.map((card, idx) => (
              <Card
                key={`${idx}-${card.name}`}
                // active={index === activeIndex}
                // removeCard={removeCard}
                data={card}
              />
            ))}
            <Card
              active={true}
              onFlip={handleFlip(cards[index]?.id)}
              data={cards[index]}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </AnimatePresence>
        ) : (
          <span className='text-xl text-white'>{constants.quiz_finished}</span>
        )}
      </div>
      <div className='flex flex-row items-center justify-between p-4 font-semibold'>
        <Button
          isDisabled={index <= 0}
          color='primary'
          isIconOnly
          variant='light'
          onPress={handlePrev}
        >
          <FaCircleChevronLeft size={30} />
        </Button>
        <p>
          {Math.min(index + 1, data.length)}/{data.length}
        </p>
        {data.length - index === 0 ? (
          <Button color='success' onPress={onClose}>
            Done
          </Button>
        ) : (
          <Button
            isDisabled={data.length - index === 0}
            color='primary'
            isIconOnly
            variant='light'
            onPress={handleNext}
          >
            <FaCircleChevronRight size={30} />
          </Button>
        )}
      </div>
    </div>
  )
}

export default Cards
