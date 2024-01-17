'use client'
import { Input, Button } from '@nextui-org/react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState, useRef } from 'react'
import { isDesktop } from 'react-device-detect'

import * as flashsetAPI from '~/apis/flashsets'
import Image from 'next/image'
import useSound from 'use-sound'
import { FaVolumeLow } from 'react-icons/fa6'
import constants from '~/utils/constants'
import { speak } from '~/utils/helpers'

export default function Dictation({ cards, flashsetId, onClose }) {
  const queryClient = useQueryClient()
  const [playSuccess] = useSound('/sound/success.mp3')
  const [playWrong] = useSound('/sound/wrong.mp3')

  const [index, setIndex] = useState(0)

  const [input, setInput] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)
  const result = useRef([])

  useEffect(() => {
    if (cards?.[index]?.frontText && isCorrect == null) {
      speak(cards[index].frontText)
    }
    if (isCorrect != null) {
      setTimeout(() => {
        setIsCorrect(null)
        setInput('')
        setIndex((s) => s + 1)
      }, 2000)
      flashsetAPI
        .histories(flashsetId, 'dictation', [
          { id: cards[index].id, result: isCorrect },
        ])
        .then(() => {
          // queryClient.refetchQueries(['flashset-cards', flashsetId, page, perPage])
        })
    }
  }, [isCorrect, index])

  const handleAnswer = () => {
    if (isCorrect != null || input.length === 0) return
    if (
      `${cards[index].frontText}`.toLowerCase() === `${input}`.toLowerCase()
    ) {
      playSuccess()
      setIsCorrect(true)
      result.current.push(true)
    } else {
      playWrong()
      setIsCorrect(false)
      result.current.push(false)
    }
  }

  const handleChange = ({ target }) => {
    setInput(target.value)
  }

  useEffect(() => {
    window.addEventListener('keyup', handleKeyPress)

    return () => {
      window.removeEventListener('keyup', handleKeyPress)
    }
  }, [])

  const handleKeyPress = (e) => {
    console.log(e.key)
    if (e.key === 'ArrowRight' || e.key === 'Enter') handleAnswer()
    // else if (e.key === 'ArrowLeft') handlePrev()
  }

  return (
    <div
      className='flex flex-1 flex-col'
      // onClick={isMobile() || !isDesktop ? handleAnswer : () => {}}
    >
      {Array.isArray(cards) && (
        <div className='mb-2 flex flex-row justify-between text-xl'>
          <span>
            {Math.min(index + 1, cards.length)}/{cards.length}
          </span>
          {/* <span>{timeLeft / 1000}s</span> */}
        </div>
      )}

      {cards[index] && (
        <div className='flex flex-col items-center gap-4'>
          <div
            className={`relative h-[28vh] w-[21vh] overflow-hidden rounded-md border-2 bg-blue-100 ${
              isCorrect
                ? 'border-green-500'
                : isCorrect == false
                ? 'border-red-500'
                : ''
            }`}
          >
            {cards[index].frontImage?.length > 0 && (
              <Image
                src={cards[index].frontImage}
                width={300}
                height={400}
                className={` h-[28vh] w-[21vh]`}
                alt='frontImage'
              />
            )}
            <Button
              className={'absolute left-2 top-2'}
              color='primary'
              isIconOnly
              variant='light'
              onPress={() => {
                new Audio(
                  `https://translate.google.com/translate_tts?ie=UTF-8&q=${cards[index].frontText}&tl=en&client=tw-ob`
                ).play()
              }}
            >
              <FaVolumeLow size={30} />
            </Button>
          </div>
          <Input
            placeholder={constants.place_dictation_input}
            className='w-48'
            value={input}
            onChange={handleChange}
          />
          <div
            className={`relative flex h-[28vh] w-[21vh] flex-col items-center justify-center overflow-hidden rounded-md border-2 bg-blue-100 ${
              isCorrect
                ? 'border-green-400 bg-green-200'
                : isCorrect == false
                ? 'border-red-400 bg-red-200'
                : ''
            }`}
          >
            <p className='text-center text-2xl'>
              {cards[index].backText || ''}
            </p>
          </div>
          <Button
            isDisabled={isCorrect !== null || input.length === 0}
            color='primary'
            onPress={handleAnswer}
          >
            Check
          </Button>
        </div>
      )}
      {!cards[index] && (
        <div className='mb-4 flex h-[60vh] w-full flex-col items-center justify-center gap-2 rounded-md bg-slate-800'>
          {/* <span className='text-xl text-white'>End of Game</span> */}
          <span className='mb-4 text-center text-4xl font-bold text-green-500'>
            {constants.label_game_finished}
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

      {/* {Array.isArray(cards) && cards.length - index >= 1 ? (
        <Cards
          ref={refCards}
          refCard={refCard}
          flashsetId={flashsetId}
          data={cards}
          disableFlip
          // onClose={onClose}
        />
      ) : (
        <div className='gradient relative flex h-full w-full flex-col items-center justify-center rounded-md bg-slate-800'>
          <span className='text-xl text-white'>End of Game</span>
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
      </div> */}

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
{
  /* <div className='mb-4 flex h-[60vh] w-full flex-col items-center justify-center gap-2 rounded-md bg-slate-800'>
        <span className='mb-4 text-2xl text-white'>End of Game</span>
        <Button color='secondary' onPress={() => setIndex(0)}>
          Next Game
        </Button>
        <Button color='danger' size='sm' onPress={onClose}>
          Quit
        </Button>
      </div> */
}
