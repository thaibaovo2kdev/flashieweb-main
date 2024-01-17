'use client'
import { Button } from '@nextui-org/react'
import { motion } from 'framer-motion'
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import ReactCardFlip from 'react-card-flip'
import { FaVolumeLow } from 'react-icons/fa6'
import Image from 'next/image'
import useSound from 'use-sound'
import { speak, useWindowSize } from '~/utils/helpers'

const Card = forwardRef(
  (
    {
      data,
      disableFlip,
      onFlip,
      onNext,
      onPrev,
      onSpeak,
      onSpeaked,
      autoSpeak,
    },
    ref
  ) => {
    const [playSound] = useSound('/sound/flipcard.mp3')

    const windowSize = useWindowSize()
    const [card, setCard] = useState(data)
    const [isFlipped, setIsFlipped] = useState(false)
    const isDrag = useRef(false)

    useImperativeHandle(ref, () => ({
      flip: () => setIsFlipped((s) => !s),
      setCard: (newcard) => {
        setIsFlipped(false)
        setCard(newcard)
      },
      setCardStatus: (isCorrect) => {
        setCard((s) => ({ ...s, isCorrect }))
      },
    }))

    useEffect(() => {
      if (JSON.stringify(card) !== JSON.stringify(data)) {
        setCard(data)
        setIsFlipped(false)
      }
    }, [data])

    const onDragEnd = (_e, info) => {
      if (info.offset.x > 100) {
        // setLeaveX(1000)
        onNext?.()
        setIsFlipped(false)
      }
      if (info.offset.x < -100) {
        // setLeaveX(-1000)
        onPrev?.()
        setIsFlipped(false)
      }
      isDrag.current = false
    }

    const handleFlipp = () => {
      if (isDrag.current || disableFlip) return
      setIsFlipped((s) => !s)
      playSound()
      onFlip?.()
    }

    if (windowSize.isLoading) return null

    const size = Math.min(windowSize.width, windowSize.height * 0.6) * 0.7
    const classNames = `absolute rounded-2xl overflow-hidden flex flex-col cursor-grab`

    return (
      <motion.div
        drag={typeof onNext !== 'function' || typeof onPrev !== 'function'}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        // initial={{
        //   scale: 1,
        // }}
        animate={{
          // scale: 1.05,
          rotate: `${card.name.length % 2 === 0 ? 6 : -6}deg`,
        }}
        exit={{
          x: 0,
          y: 0,
          opacity: 0,
          // scale: 0.5,
          transition: { duration: 0.2 },
        }}
        className={classNames}
        style={{
          height: size,
          width: size * 0.75,
          boxShadow: '8px 8px rgb(0 0 0 / 0.01)',
        }}
        data-testid='active-card'
        onDragEnd={onDragEnd}
        onClick={handleFlipp}
        onDrag={() => {
          isDrag.current = true
        }}
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
            autoSpeak={autoSpeak}
            onSpeak={onSpeak}
          />

          <CardItem
            image={card.backImage}
            text={card.backText}
            color={card.color}
            isCorrect={card.isCorrect}
            onSpeak={onSpeak}
            onSpeaked={onSpeaked}
          />
        </ReactCardFlip>
      </motion.div>
    )
  }
)

const CardItem = ({
  image,
  text,
  color,
  isCorrect,
  onSpeak,
  onSpeaked,
  autoSpeak,
}) => {
  // const { speak } = useSpeechSynthesis()
  // const [speak] = useSound(
  //   `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=en&client=tw-ob`
  // )
  useEffect(() => {
    console.log(autoSpeak, 'autoSpeakautoSpeak')
    if (autoSpeak) speak(text)
  }, [text])

  const handleSpeak = () => {
    if (typeof onSpeak == 'function') {
      onSpeak()
      return
    }
    console.log(text, 'texttext')
    speak(text)
    onSpeaked?.()
  }

  if (!image && text) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-blue-400`}
        style={{
          backgroundColor:
            isCorrect == true
              ? '#01ac47'
              : isCorrect == false
              ? '#bf0118'
              : color,
        }}
      >
        <div
          className='absolute bottom-2 left-2 right-2 top-2 flex flex-col items-center justify-center rounded-lg bg-white'
          style={{
            backgroundColor:
              isCorrect == true
                ? '#89f9b6'
                : isCorrect == false
                ? '#ff8989'
                : '#fff',
          }}
        >
          <p className='text-center text-2xl font-semibold'>{text}</p>
        </div>

        <Button
          className='absolute left-2 top-2'
          color='primary'
          isIconOnly
          variant='light'
          onPress={handleSpeak}
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
        onPress={handleSpeak}
      >
        <FaVolumeLow size={30} />
      </Button>
    </div>
  )
}

export default Card
