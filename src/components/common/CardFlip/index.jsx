'use client'
import { Button } from '@nextui-org/react'
import { useEffect, memo, useState, useCallback } from 'react'
import { FaVolumeLow } from 'react-icons/fa6'
import { useSpeechSynthesis } from 'react-speech-kit'
import useSound from 'use-sound'

const CardFlip = ({ data, onChange }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const { speak } = useSpeechSynthesis()
  const [playSound] = useSound('/sound/flipcard.mp3')

  const handleClick = () => {
    setIsFlipped((s) => !s)
    playSound()
  }
  useEffect(() => {
    onChange && onChange(isFlipped)
  }, [isFlipped])
  return (
    <div isFlipped={isFlipped} flipDirection='horizontal'>
      <div
        className='mt-4 flex h-[30em] w-[25em] flex-col rounded-lg bg-blue-400'
        onClick={handleClick}
      >
        <img
          className='mx-2 mt-2 h-[100%] w-[24em] rounded-lg'
          src={data?.frontImage}
        />
        <Button
          className='absolute left-2 top-2'
          color='primary'
          isIconOnly
          variant='light'
          onPress={() => speak({ text: data.frontText })}
        >
          <FaVolumeLow size={30} />
        </Button>

        <p className='m-2 rounded-lg bg-white p-2 text-center text-2xl font-semibold'>
          {data?.frontText}
        </p>
      </div>

      <div
        className='mt-4 flex h-[30em] w-[25em] flex-col rounded-lg bg-blue-400'
        onClick={handleClick}
      >
        <img
          className='mx-2 mt-2 h-[100%] w-[24em] rounded-lg'
          src={data?.backImage}
        />
        <Button
          className='absolute left-2 top-2'
          color='primary'
          isIconOnly
          variant='light'
          onPress={() => speak({ text: data.backText })}
        >
          <FaVolumeLow size={30} />
        </Button>

        <p className='m-2 rounded-lg bg-white p-2 text-center text-2xl font-semibold'>
          {data?.backText}
        </p>
      </div>
    </div>
  )
}

function areEqual(p, n) {
  return JSON.stringify(p.data) === JSON.stringify(n.data)
}

export default memo(CardFlip, areEqual)
