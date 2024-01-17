'use client'
import { memo, useEffect, useRef, useState } from 'react'

import { Button } from '@nextui-org/react'
import { shuffle } from '~/utils/helpers'

const Answers = ({ answer, onAnswer }) => {
  const answers = useRef([])

  const [result, setResult] = useState([])
  const [rand, setRand] = useState([])

  useEffect(() => {
    console.log('object', JSON.stringify(answers) !== JSON.stringify(answer))
    if (JSON.stringify(answers) !== JSON.stringify(answer)) {
      answers.current = answer
      setRand(shuffle(answer))
      setResult(answer.map((i) => null))
    }
  }, [answer])

  useEffect(() => {
    console.log(result, 'resultresult', !result.some((i) => !i))
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

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='flex flex-row gap-2'>
        {result.map((item, idx) => (
          <Button
            key={`${item?.key}${idx}`}
            isIconOnly
            size='sm'
            onPress={handleSelect(null, idx)}
          >
            <span className='text-xl'>{item?.value}</span>
          </Button>
        ))}
      </div>
      <div className='flex flex-row gap-2'>
        {rand.map((item, idx) => {
          const val =
            result.findIndex((i) => i?.key === item.key) > -1 ? '' : item.value
          return (
            <Button
              key={`${item.value}${idx}`}
              isIconOnly
              variant='bordered'
              isDisabled={!val}
              onPress={handleSelect(
                item,
                result.findIndex((i) => !i)
              )}
              className={!val ? 'bg-slate-700 opacity-5' : 'bg-slate-100'}
            >
              <span className='text-xl'>{val}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(
  Answers,
  (p, n) => JSON.stringify(p.answer) === JSON.stringify(n.answer)
)
