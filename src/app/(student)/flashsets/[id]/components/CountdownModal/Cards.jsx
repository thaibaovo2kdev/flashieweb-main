'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import Card from './Card'
import { BsFillPatchCheckFill } from 'react-icons/bs'
import { useQueryClient } from '@tanstack/react-query'
import { alert, shuffle } from '~/utils/helpers'
import Image from 'next/image'
import useSound from 'use-sound'
import { AiFillCloseCircle } from 'react-icons/ai'
import useCountDown from 'react-countdown-hook'

import * as flashsetAPI from '~/apis/flashsets'

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
  const [playSuccess] = useSound('/sound/success.mp3')
  const [playWrong] = useSound('/sound/wrong.mp3')
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    180 * 1000,
    1000
  )

  const [cards, setCards] = useState(
    data.map((i) => ({
      ...i,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  )
  const card = useRef()
  const cardImgs = useRef(
    [...data.map((i) => i.frontImage), ...data.map((i) => i.backImage)].filter(
      (i) => !!i
    )
  )
  const cardTexts = useRef(
    [...data.map((i) => i.frontText), ...data.map((i) => i.backText)].filter(
      (i) => !!i
    )
  )

  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState({
    questionContent: '',
    questionType: '',
    answerTrue: '',
    answerType: '',
    answers: [],
  })
  const [selected, setSelected] = useState(-1)
  const [isCorrect, setIsCorrect] = useState(null)
  const started = useRef(false)

  useEffect(() => {
    if (question.answerTrue.length > 0) {
      start()
      setTimeout(() => {
        started.current = true
      }, 2000)
    }
  }, [question])

  useEffect(() => {
    if (timeLeft <= 0 && started.current) {
      alert.warning('Timeout!').then(onClose)
    }
  }, [timeLeft, question])

  useEffect(() => {
    if (index >= cards.length) return
    const card = cards[index]
    const ques = question

    // Front Text exists, Back Image exists
    if (card.frontText?.length > 0 && card.backImage?.length > 0) {
      ques.questionContent = card.frontText
      ques.questionType = 'text'
      ques.answerType = 'image'
      ques.answerTrue = card.backImage
    }
    // Front Text exists, Back Image empty
    if (card.frontText?.length > 0 && card.backImage?.length === 0) {
      ques.questionContent = card.frontText
      ques.questionType = 'text'
      ques.answerType = 'text'
      ques.answerTrue = card.backText
    }

    // Front Image exists, Back Text exists
    if (card.frontImage?.length > 0 && card.backText?.length > 0) {
      ques.questionContent = card.frontImage
      ques.questionType = 'image'
      ques.answerType = 'text'
      ques.answerTrue = card.backText
    }
    // Front Image exists, Back Text empty
    if (card.frontImage?.length > 0 && card.backText?.length === 0) {
      ques.questionContent = card.frontImage
      ques.questionType = 'image'
      ques.answerType = 'image'
      ques.answerTrue = card.backImage
    }

    const randAnswers = shuffle(
      ques.answerType === 'image' ? cardImgs.current : cardTexts.current
    )
    const _answers = randAnswers
      .filter((i) => i !== ques.answerTrue)
      .slice(0, 3)
    console.log(_answers, '_answers', randAnswers)
    ques.answers = shuffle([..._answers, ques.answerTrue])
    setQuestion({ ...ques })
  }, [index])

  useEffect(() => {
    if (isCorrect != null) {
      setTimeout(() => {
        setIsCorrect(null)
        setSelected(-1)
        setIndex((s) => s + 1)
      }, 2000)
    }
  }, [isCorrect])

  useEffect(() => {
    if (index > 0) {
      // const flashcards = cards.filter(() => )
      flashsetAPI.countdown(flashsetId, [cards[index].id]).then(() => {
        queryClient.refetchQueries(['flashset', flashsetId])
      })
    }
  }, [index])

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

  const handleAnswer = (img) => () => {
    if (isCorrect != null) return
    card.current.flip?.()
    if (question.answerTrue === img) {
      playSuccess()
      setIsCorrect(true)
    } else {
      playWrong()
      setIsCorrect(false)
    }
    setSelected(question.answers.findIndex((i) => i === img))
  }

  return (
    <div className='flex flex-col'>
      <div className='mb-2 flex flex-row justify-between text-xl'>
        <span>
          {index}/{cards.length}
        </span>
        <span>{timeLeft / 1000}s</span>
      </div>

      <div className='gradient relative flex h-[60vh] w-full flex-col items-center justify-center rounded-md bg-slate-800'>
        {cards.length - index >= 1 ? (
          <AnimatePresence>
            {cards.map((card, idx) => (
              <Card key={`${idx}-${card.name}`} data={card} />
            ))}
            <Card
              ref={card}
              active={true}
              onFlip={handleFlip(cards[index]?.id)}
              data={cards[index]}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </AnimatePresence>
        ) : (
          <span className='text-xl text-white'>End of Game</span>
        )}

        {isCorrect !== null && (
          <div className='absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]'>
            {isCorrect ? (
              <BsFillPatchCheckFill size={100} className='text-green-500' />
            ) : (
              <AiFillCloseCircle size={100} className='text-red-500' />
            )}
          </div>
        )}
      </div>
      <div className='grid grid-cols-2 justify-center gap-4 p-4 pb-4 md:grid-cols-4'>
        {cards.length - index >= 1 &&
          [...question.answers].map((i, idx) =>
            question.answerType == 'image' ? (
              <div
                key={`${i}-${idx}`}
                onClick={handleAnswer(i)}
                className={`md;border-4 flex h-[70px] w-full flex-1 cursor-pointer flex-col items-center justify-center border-1 ${
                  idx == selected
                    ? 'border-purple-500 bg-purple-100'
                    : 'border-blue-500'
                }  p-2`}
              >
                <Image
                  key={`${i}-${idx}`}
                  width={70}
                  height={70}
                  src={i}
                  className='h-full w-full object-contain'
                  // className={`cursor-pointer border-4 ${
                  //   idx == selected ? 'border-purple-500' : 'border-blue-500'
                  // }`}
                />
              </div>
            ) : (
              <div
                key={`${i}-${idx}`}
                onClick={handleAnswer(i)}
                className={`md;border-4 flex h-[70px] w-full flex-1 cursor-pointer flex-col items-center justify-center border-1 ${
                  idx == selected
                    ? 'border-purple-500 bg-purple-100'
                    : 'border-blue-500'
                }  p-2`}
              >
                {i}
              </div>
            )
          )}
      </div>
    </div>
  )
}

export default Cards
