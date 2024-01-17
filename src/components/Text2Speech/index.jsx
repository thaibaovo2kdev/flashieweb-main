import { Button } from '@nextui-org/react'
import React from 'react'
import useSound from 'use-sound'
import { FaVolumeLow } from 'react-icons/fa6'

export default function Text2Speech({ text, className }) {
  return (
    <Button
      className={className || 'absolute left-4 top-4'}
      color='primary'
      isIconOnly
      variant='light'
      onPress={() => {
        new Audio(
          `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=en&client=tw-ob`
        ).play()
      }}
    >
      <FaVolumeLow size={30} />
    </Button>
  )
}
