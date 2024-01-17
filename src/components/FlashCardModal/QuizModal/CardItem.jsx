'use client'
import { Button } from '@nextui-org/react'
import { useSpeechSynthesis } from 'react-speech-kit'
import { FaVolumeLow } from 'react-icons/fa6'
import Image from 'next/image'

const CardItem = ({ image, text, color }) => {
  const { speak } = useSpeechSynthesis()

  if (!image && text) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-blue-400`}
        style={{ backgroundColor: color }}
      >
        <div className='absolute bottom-2 left-2 right-2 top-2 flex flex-col items-center justify-center rounded-lg bg-white'>
          <p className='text-center text-2xl font-semibold'>{text}</p>
        </div>

        <Button
          className='absolute left-2 top-2'
          color='primary'
          isIconOnly
          variant='light'
          onPress={() => speak({ text })}
        >
          <FaVolumeLow size={30} />
        </Button>
      </div>
    )
  }
  if (image && !text) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-blue-400`}
        style={{ backgroundColor: color }}
      >
        <div className='absolute bottom-2 left-2 right-2 top-2 flex flex-col items-center justify-center rounded-lg bg-white'>
          <Image
            width={300}
            height={430}
            draggable={false}
            className='h-[430px] w-[300px] rounded-lg'
            src={image}
            alt={image}
          />
        </div>
      </div>
    )
  }
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center bg-blue-400`}
      style={{ backgroundColor: color }}
    >
      <div className='absolute bottom-2 left-2 right-2 top-2 overflow-hidden rounded-lg bg-white'>
        <Image
          width={284}
          height={414}
          draggable={false}
          className='h-[414px] w-[284px] rounded-xl'
          src={image}
          alt={image}
        />
        <div
          className='absolute bottom-0 left-0 right-0 flex w-full flex-col border-t-4 border-blue-400 bg-white p-2 text-center'
          style={{
            borderColor: color,
          }}
        >
          {text}
        </div>
      </div>
      <Button
        className='absolute left-2 top-2'
        color='primary'
        isIconOnly
        variant='light'
        onPress={() => speak({ text })}
      >
        <FaVolumeLow size={30} />
      </Button>
    </div>
  )
}

export default CardItem
