import { Button, Input } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Blank({ onAnswer, isCorrect }) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (text && isCorrect == null) setText('')
  }, [isCorrect])

  const handleChange = ({ target }) => {
    setText(target.value)
  }

  const handleAnswer = () => {
    onAnswer?.(text)
  }

  return (
    <div className='my-4 flex flex-col items-center gap-2'>
      <Input
        onChange={handleChange}
        placeholder='Input'
        className='w-56'
        color={isCorrect ? 'success' : 'default'}
        value={text}
      />
      <Button
        color='primary'
        isDisabled={isCorrect != null}
        onPress={handleAnswer}
      >
        Check
      </Button>
    </div>
  )
}
