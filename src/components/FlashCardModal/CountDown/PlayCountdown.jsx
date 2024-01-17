'use client'
import {
  Button
} from '@nextui-org/react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import Cards from '../components/Cards'

import Image from 'next/image'
import useCountDown from 'react-countdown-hook'
import Swal from 'sweetalert2'
import useSound from 'use-sound'
import * as flashsetAPI from '~/apis/flashsets'
import { shuffle } from '~/utils/helpers'

export default function PlayCountdown({ cards, flashsetId, onClose }) {
  const queryClient = useQueryClient()
  const [playSuccess] = useSound('/sound/success.mp3')
  const [playWrong] = useSound('/sound/wrong.mp3')
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    90 * 1000,
    1000
  )
  const result = useRef([])
  const refCard = useRef()
  const refCards = useRef()
  const cardImgs = useRef(
    [
      ...cards.map((i) => i.frontImage),
      ...cards.map((i) => i.backImage),
    ].filter((i) => !!i)
  )
  const cardTexts = useRef([
    ...cards.map((i) => i.frontText),
    ...cards.map((i) => i.frontText),
  ])
  const cardAnswers = useRef([
    ...cards.map((i) => i.backText).filter((i) => !!i),
  ])
  const frontAnswersText = useRef([
    ...cards.map((i) => i.frontText).filter((i) => !!i),
  ])
  const frontAnswersImage = useRef([
    ...cards.map((i) => i.frontImage).filter((i) => !!i),
  ])
  const backAnswersText = useRef([
    ...cards.map((i) => i.backText).filter((i) => !!i),
  ])
  const backAnswersImage = useRef([
    ...cards.map((i) => i.backImage).filter((i) => !!i),
  ])

  // .filter((i) => !!i)
  // console.log(frontAnswersText.current, backAnswersText.current)
  // const cards = useQuery({
  //   enabled: isOpen,
  //   queryKey: ['flashset-cards', flashsetId, page, perPage],
  //   queryFn: () =>
  //     flashsetAPI
  //       .getFlashcards({ id: flashsetId, page, perPage })
  //       .then((res) => {
  //         cardImgs.current = [
  //           ...res.data.map((i) => i.frontImage),
  //           ...res.data.map((i) => i.backImage),
  //         ].filter((i) => !!i)
  //         cardTexts.current = [
  //           ...res.data.map((i) => i.frontText),
  //           ...res.data.map((i) => i.backText),
  //         ].filter((i) => !!i)
  //         return res
  //       }),
  //
  // })

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
    start()
  }, [])
  useEffect(() => {
    if (timeLeft === 1000) {
      Swal.fire('Timeout!')
    }
  }, [timeLeft])
  useEffect(() => {
    if (index >= cards.length) pause()
  }, [index])

  useEffect(() => {
    if (index === -1 || index >= cards.length) return
    const card = cards[index]
    if (!card) return
    const ques = question
    console.log(card, 'card')

    // Trường hợp có frontext - front image thì show đủ cả 2.
    // Trường hợp có back text- backimage thì show đủ cả 2.
    // Điều kiện làm quiz, playcountdown, dictation
    // Trường hợp có front text, có hoặc ko có front image, có back text, có hoặc - ko có back image: đủ điều kiện để tạo quiz và dictation, play countdown.
    //  TH 1: Mặt gợi ý: front text - đáp án là back text
    //  TH 2: mặt show là back - đáp án là front text.
    // Trường hợp có front text, ko có back text, có back image. Trường hợp này ko đủ tham gia dictation.
    //  TH: Mặt show: back image - đáp án là front text.

    // ques.answerTrue = card.backText
    const isFront =
      card.frontText && card.backText ? getRandomInt(1, 9) % 2 === 0 : true

    if (isFront) {
      ques.questionContent = card.frontText
      ques.questionType = 'text'
      ques.answerType = 'text'
      ques.answerTrue = card.backText

      const randAnswers = shuffle(backAnswersText.current)
      const _answers = randAnswers
        .filter((i) => i.toLowerCase() !== ques.answerTrue.toLowerCase())
        .slice(0, 3)
      ques.answers = shuffle([..._answers, ques.answerTrue])
      setQuestion({ ...ques })
      refCard.current.setCard(card)
    } else {
      if (card.backText?.length > 0 && !card.backImage) {
        ques.questionContent = card.backText
        ques.questionType = 'text'
        ques.answerType = 'text'
        ques.answerTrue = card.frontText
        const randAnswers = shuffle(frontAnswersText.current)
        const _answers = randAnswers
          .filter((i) => i.toLowerCase() !== ques.answerTrue.toLowerCase())
          .slice(0, 3)
        ques.answers = shuffle([..._answers, ques.answerTrue])
        setQuestion({ ...ques })
        refCard.current.setCard(card)
      } else {
        ques.questionContent = card.backImage
        ques.questionType = 'image'
        ques.answerType = 'text'
        ques.answerTrue = card.frontText
        const randAnswers = shuffle(frontAnswersText.current)
        const _answers = randAnswers
          .filter((i) => i.toLowerCase() !== ques.answerTrue.toLowerCase())
          .slice(0, 3)
        ques.answers = shuffle([..._answers, ques.answerTrue])
        setQuestion({ ...ques })
        refCard.current.setCard(card)
      }
    }

    // Front Text exists, Back Image exists
    // if (card.frontText?.length > 0 && card.backImage?.length > 0) {
    //   ques.questionContent = card.frontText
    //   ques.questionType = 'text'
    //   ques.answerType = 'image'
    //   ques.answerTrue = card.backImage
    // }
    // // Front Text exists, Back Image empty
    // if (card.frontText?.length > 0 && card.backImage?.length === 0) {
    //   ques.questionContent = card.frontText
    //   ques.questionType = 'text'
    //   ques.answerType = 'text'
    //   ques.answerTrue = card.backText
    // }

    // // Front Image exists, Back Text exists
    // if (card.frontImage?.length > 0 && card.backText?.length > 0) {
    //   ques.questionContent = card.frontImage
    //   ques.questionType = 'image'
    //   ques.answerType = 'text'
    //   ques.answerTrue = card.backText
    // }
    // // Front Image exists, Back Text empty
    // if (card.frontImage?.length > 0 && card.backText?.length === 0) {
    //   ques.questionContent = card.frontImage
    //   ques.questionType = 'image'
    //   ques.answerType = 'image'
    //   ques.answerTrue = card.backImage
    // }

    // const randAnswers = shuffle(
    //   ques.answerType === 'image' ? cardImgs.current : cardAnswers.current
    // )
    // const _answers = randAnswers
    //   .filter((i) => i.toLowerCase() !== ques.answerTrue.toLowerCase())
    //   .slice(0, 3)
    // console.log(ques, 'ques')
    // ques.answers = shuffle([..._answers, ques.answerTrue])
    // setQuestion({ ...ques })
    // refCard.current.setCard(card)
  }, [index])

  useEffect(() => {
    if (isCorrect != null) {
      console.log('object')
      setTimeout(() => {
        setIsCorrect(null)
        setSelected(-1)
        setIndex((s) => s + 1)
      }, 2000)
      flashsetAPI
        .histories(flashsetId, 'countdown', [
          { id: cards[index].id, result: isCorrect },
        ])
        .then(() => {
          // queryClient.refetchQueries(['flashset', flashsetId])
        })
    }
  }, [isCorrect, index])

  const handleAnswer = (img) => () => {
    if (isCorrect != null) return
    refCard.current.flip?.()
    if (question.answerTrue === img) {
      playSuccess()
      setIsCorrect(true)
      result.current.push(true)
    } else {
      playWrong()
      setIsCorrect(false)
      result.current.push(false)
    }
    setSelected(question.answers.findIndex((i) => i === img))
  }

  return (
    <div className='flex flex-1 flex-col'>
      {Array.isArray(cards) && (
        <div className='mb-2 flex flex-row justify-between text-xl'>
          <span>
            {index}/{cards.length}
          </span>
          <span>{timeLeft / 1000}s</span>
        </div>
      )}

      {Array.isArray(cards) && cards.length - index >= 1 ? (
        <Cards
          ref={refCards}
          refCard={refCard}
          flashsetId={flashsetId}
          data={cards}
          disableFlip
          cardData={{
            ...cards[index],
            frontText:
              question.questionType === 'text' ? question.questionContent : '',
            backText: question.answerTrue,
            frontImage:
              question.questionType === 'image' ? question.questionContent : '',
            backImage: '',
          }}
          // onClose={onClose}
        />
      ) : (
        <div className='gradient relative flex h-full w-full flex-col items-center justify-center rounded-md bg-slate-800'>
          {/* <span className='text-xl text-white'>End of Game</span> */}
          <span className='mb-4  text-center text-5xl font-bold text-green-500'>
            Scene Completed
          </span>
          <div className='flex flex-row gap-4'>
            <span className='mb-4 text-lg font-bold text-green-300'>
              Point: {result.current.filter((i) => !!i).length * 3}
            </span>
            <span className='mb-4 text-lg font-bold text-green-300'>
              Correct: {result.current.filter((i) => !!i).length}
            </span>
          </div>
          <div className='flex flex-row gap-4'>
            <Button onPress={onClose}>CLOSE</Button>
            {/* <Button onPress={handleContinue} color='primary'>
              CONTINUE
            </Button> */}
          </div>
        </div>
      )}

      <div className='grid grid-cols-2 justify-center gap-4 p-4 pb-4 md:grid-cols-4'>
        {Array.isArray(cards) &&
          cards?.length - index >= 1 &&
          [...question.answers].map((i, idx) =>
            question.answerType == 'image' ? (
              <div
                key={`${i}-${idx}`}
                onClick={handleAnswer(i)}
                className={`md;border-4 flex h-[70px] w-full flex-1 cursor-pointer flex-col items-center justify-center border-1 ${
                  idx == selected
                    ? isCorrect
                      ? 'border-green-600 bg-green-200'
                      : 'border-red-600 bg-red-200'
                    : 'border-blue-500'
                }  p-2`}
              >
                <Image
                  key={`${i}-${idx}`}
                  width={70}
                  height={70}
                  src={i}
                  className='h-full w-full object-contain'
                />
              </div>
            ) : (
              <div
                key={`${i}-${idx}`}
                onClick={handleAnswer(i)}
                className={`md;border-4 flex h-[70px] w-full flex-1 cursor-pointer flex-col items-center justify-center border-1 ${
                  idx == selected
                    ? isCorrect
                      ? 'border-green-600 bg-green-200'
                      : 'border-red-600 bg-red-200'
                    : 'border-blue-500'
                }  p-2`}
              >
                {i}
              </div>
            )
          )}
      </div>

      {/* {isCorrect !== null && (
                    <div className='absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]'>
                      {isCorrect ? (
                        <BsFillPatchCheckFill
                          size={100}
                          className='text-green-500'
                        />
                      ) : (
                        <AiFillCloseCircle
                          size={100}
                          className='text-red-500'
                        />
                      )}
                    </div>
                  )} */}
    </div>
  )
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
