'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import Card from './Card'
import { BsFillPatchCheckFill } from 'react-icons/bs'
import * as flashsetAPI from '~/apis/flashsets'
import { useQueryClient } from '@tanstack/react-query'
import Answers from './Answers'
import useSound from 'use-sound'
import { AiFillCloseCircle } from 'react-icons/ai'

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

    // const randAnswers = shuffle(
    //   ques.answerType === 'image' ? cardImgs.current : cardTexts.current
    // )
    // const _answers = randAnswers
    //   .filter((i) => i !== ques.answerTrue)
    //   .slice(0, 3)
    // ques.answers = shuffle([..._answers, ques.answerTrue])
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

  const handleAnswer = (img) => {
    console.log(question, img)
    if (isCorrect != null) return
    card.current.flip?.()
    if (question.answerTrue.toUpperCase() === img) {
      playSuccess()
      setIsCorrect(true)
      // setQuestion((s) => ({ ...s, answers: [] }))
    } else {
      playWrong()
      setIsCorrect(false)
      // setQuestion((s) => ({ ...s, answers: [] }))
    }
    setSelected(question.answers.findIndex((i) => i === img))
  }

  console.log(question, 'imguqesss')
  return (
    <div className='flex flex-col'>
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
      <div className='flex flex-row justify-center gap-4 p-4 pb-4'>
        {cards.length - index >= 1 && (
          <Answers
            answer={question.answerTrue
              .split('')
              .map((i, idx) => ({ key: idx, value: i.toUpperCase() }))}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  )
}

export default Cards
