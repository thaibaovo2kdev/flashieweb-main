'use client'
import { memo, useEffect, useRef, useState } from 'react'

import { Button } from '@nextui-org/react'
import { shuffle, useWindowSize } from '~/utils/helpers'

const Answers = ({ answer, onAnswer, isCorrect }) => {
  const answers = useRef([])
  const windowSize = useWindowSize()

  const [result, setResult] = useState([])
  const [rand, setRand] = useState([])

  useEffect(() => {
    if (JSON.stringify(answers) !== JSON.stringify(answer)) {
      answers.current = answer
      setRand(shuffle(answer))
      setResult(answer.map((i) => null))
    }
  }, [answer])

  useEffect(() => {
    if (result.length > 0 && !result.some((i) => !i)) {
      onAnswer(result.map((i) => i.value).join(''))
    }
  }, [result])

  const handleSelect = (item, idx) => () => {
    setResult((s) => {
      s[idx] = item
      return [...s]
    })
  }

  const numRow = result.length > 20 ? 10 : Math.round(result.length * 0.5)

  const sizebtn = (windowSize.width - 60) / numRow - 4

  return (
    <div className='flex flex-col items-center gap-2 pt-2'>
      <div className='flex max-w-[90vw] flex-row flex-wrap justify-center gap-1'>
        {result.map((item, idx) => (
          <div
            key={`${item?.key}${idx}`}
            style={{
              width: Math.min(sizebtn, 32),
              height: Math.min(sizebtn, 32),
            }}
            className='flex cursor-pointer flex-col items-center justify-center rounded-md bg-gray-400'
            // color={isCorrect ? 'success' : 'danger'}
            onClick={handleSelect(null, idx)}
          >
            <span className='text-xl'>{item?.value}</span>
          </div>
        ))}
      </div>
      <div className='flex max-w-[90vw] flex-row flex-wrap justify-center gap-1'>
        {rand.map((item, idx) => {
          const val =
            result.findIndex((i) => i?.key === item.key) > -1 ? '' : item.value
          console.log(`item?.value|${item?.value === ' '}|`)
          return (
            <div
              key={`${item?.key}${idx}`}
              style={{
                width: Math.min(sizebtn, 32),
                height: Math.min(sizebtn, 32),
              }}
              onClick={
                !val
                  ? undefined
                  : handleSelect(
                      item,
                      result.findIndex((i) => !i)
                    )
              }
              className={`flex cursor-pointer flex-col items-center justify-center rounded-md ${
                !val
                  ? item?.value === ' '
                    ? ' bg-slate-300'
                    : 'bg-slate-700 opacity-5'
                  : item?.value === ' '
                  ? 'bg-slate-500'
                  : 'bg-slate-100'
              }`}
            >
              <span className='text-xl'>{item?.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(
  Answers,
  (p, n) =>
    JSON.stringify(p.answer) === JSON.stringify(n.answer) &&
    p.isCorrect === n.isCorrect
)
