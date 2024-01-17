'use client'
import { Button } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import ReactCardFlip from 'react-card-flip'
import { useSpeechSynthesis } from 'react-speech-kit'
import { FaVolumeLow } from 'react-icons/fa6'
import Image from 'next/image'
import useSound from 'use-sound'

const Card = forwardRef(({ data, active }, ref) => {
  const [card, setCard] = useState(data)
  const [isFlipped, setIsFlipped] = useState(false)

  useImperativeHandle(ref, () => ({
    flip: () => setIsFlipped((s) => !s),
  }))

  useEffect(() => {
    if (JSON.stringify(card) !== JSON.stringify(data)) {
      setCard(data)
      setIsFlipped(false)
    }
  }, [data])
  //h-[330px] w-[200px] md:h-[430px] md:w-[300px]
  const classNames = `absolute h-[50vh] w-[37vh] shadow-xl rounded-2xl overflow-hidden flex flex-col cursor-grab`

  return (
    <motion.div
      drag={false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      initial={{
        scale: 1,
      }}
      animate={{
        scale: 1.05,
        rotate: `${card.name.length % 2 === 0 ? 6 : -6}deg`,
      }}
      exit={{
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.2 },
      }}
      className={classNames}
      data-testid='active-card'
    >
      <ReactCardFlip
        containerClassName='h-full w-full'
        isFlipped={isFlipped}
        flipDirection='horizontal'
      >
        <CardItem
          image={card.frontImage}
          text={card.frontText}
          color={card.color}
        />

        <CardItem
          image={card.backImage}
          text={card.backText}
          color={card.color}
        />
      </ReactCardFlip>
    </motion.div>
  )
})

const CardItem = ({ image, text, color }) => {
  // const { speak } = useSpeechSynthesis()
  const [speak] = useSound(
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=en&client=tw-ob`
  )
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
          onPress={() => speak()}
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
            className='h-full w-full rounded-lg'
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
          className='h-full w-full rounded-xl'
          src={image}
          alt={image}
        />
        {/* <div
          className='absolute bottom-0 left-0 right-0 flex w-full flex-col border-t-4 border-blue-400 bg-white p-2 text-center'
          style={{
            borderColor: color,
          }}
        >
          {text}
        </div> */}
      </div>
      <Button
        className='absolute left-2 top-2'
        color='primary'
        isIconOnly
        variant='light'
        onPress={() => speak()}
      >
        <FaVolumeLow size={30} />
      </Button>
    </div>
  )
}

export default Card
