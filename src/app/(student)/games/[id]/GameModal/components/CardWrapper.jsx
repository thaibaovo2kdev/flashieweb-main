'use client'
import Image from 'next/image'
import { memo } from 'react'
import { useWindowSize } from '~/utils/helpers'
import ReactCardFlip from 'react-card-flip'
import { AiFillCheckCircle } from 'react-icons/ai'

const Item = memo(
  ({ data, selected, onSelect, style = {}, isFlipped, isCompleted }) => {
    if (isFlipped) {
      return (
        <ReactCardFlip isFlipped={selected} flipDirection='horizontal'>
          <div
            onClick={onSelect}
            style={style}
            className='cursor-pointer overflow-hidden rounded-2xl border-4 border-[#1C3E6D] bg-white'
          >
            <Image
              src={'/img/matching_game_backcover.png'}
              width={320}
              height={320}
              className='h-full w-full'
              alt=''
            />
          </div>
          <div
            onClick={selected ? () => {} : onSelect}
            style={style}
            className='cursor-pointer overflow-hidden rounded-2xl border-4 border-[#1C3E6D] bg-white'
          >
            {data.frontImage || data.backImage ? (
              <Image
                src={data.frontImage || data.backImage}
                width={320}
                height={320}
                className='h-full w-full'
                alt=''
              />
            ) : (
              <div className='flex h-full w-full flex-row items-center justify-center text-sm'>
                <span>{data.frontText}</span>
              </div>
            )}
          </div>
        </ReactCardFlip>
      )
    }

    return (
      <div
        onClick={selected ? () => {} : onSelect}
        style={{
          ...style,
          borderColor: selected ? `${data.color}` : undefined,
          backgroundColor: selected ? `${data.color}` : '#fff',
          color: selected ? `#fff` : '#222',
        }}
        className='relative cursor-pointer overflow-hidden rounded-2xl border-4 border-gray-200'
      >
        {data.frontImage || data.backImage ? (
          <Image
            src={data.frontImage || data.backImage}
            width={320}
            height={320}
            className='h-full w-full'
            alt=''
          />
        ) : (
          <div className='flex h-full w-full flex-row items-center justify-center text-sm'>
            <span>{data.frontText}</span>
          </div>
        )}
        {isCompleted ? (
          <div className='absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.5)] text-green-500'>
            <AiFillCheckCircle size={30} />
          </div>
        ) : null}
      </div>
    )
  },
  (p, n) =>
    JSON.stringify(p.data) === JSON.stringify(n.data) &&
    p.selected === n.selected &&
    JSON.stringify(p.style) === JSON.stringify(n.style) &&
    p.isFlipped === n.isFlipped &&
    p.isCompleted === n.isCompleted
)

export const CardWrapper2 = ({
  cards,
  selected,
  result,
  onSelect,
  isFlipped,
}) => {
  const windowSize = useWindowSize()
  const size = Math.min(windowSize.width - 48, windowSize.height, 624)
  const itemSize = size / 2 - 8
  return (
    <div className='mb-2 flex flex-row flex-wrap items-center justify-center'>
      {cards?.map?.((i, idx) => (
        <Item
          key={`${idx}-${i.id}`}
          data={i}
          style={{ width: itemSize * 0.75, height: itemSize, margin: 4 }}
          isFlipped={isFlipped}
          // size={itemSizes[`${cards.length}`]}
          // onSelect={() => {
          //   setSelected((s) => {
          //     if (s.length >= 2) return s
          //     playFlipcard()
          //     return s.indexOf(idx) > -1
          //       ? s.filter((i) => s != idx)
          //       : [...s, idx]
          //   })
          // }}
          // selected={selected.includes(idx) || result.includes(i.id)}
          onSelect={onSelect(idx)}
          selected={selected.includes(idx) || result.includes(i.id)}
          isCompleted={result.includes(i.id)}
        />
      ))}
    </div>
  )
}

export const CardWrapper4 = ({
  cards,
  selected,
  result,
  onSelect,
  isFlipped,
}) => {
  const windowSize = useWindowSize()
  const size = Math.min(windowSize.width - 48, windowSize.height * 0.8, 624)
  const itemSize = size / 4 - 8
  return (
    <div
      className=' mb-2 flex aspect-square flex-row flex-wrap content-center'
      style={{ width: size, paddingLeft: itemSize / 2 }}
    >
      {cards?.map?.((i, idx) => (
        <Item
          key={`${idx}-${i.id}`}
          data={i}
          style={{ width: itemSize * 0.75, height: itemSize, margin: 4 }}
          isFlipped={isFlipped}
          onSelect={onSelect(idx)}
          selected={selected.includes(idx) || result.includes(i.id)}
          isCompleted={result.includes(i.id)}
        />
      ))}
    </div>
  )
}

export const CardWrapper6 = ({
  cards,
  onSelect,
  result,
  selected,
  isFlipped,
}) => {
  const windowSize = useWindowSize()
  const size = Math.min(windowSize.width - 48, windowSize.height * 0.8, 624)
  const itemSize = size / 4 - 8
  return (
    <div
      className=' mb-2 flex aspect-square flex-row flex-wrap content-center'
      style={{ width: size, paddingLeft: itemSize / 2 }}
    >
      {cards?.map?.((i, idx) => (
        <Item
          key={`${idx}-${i.id}`}
          data={i}
          style={{ width: itemSize * 0.75, height: itemSize, margin: 4 }}
          isFlipped={isFlipped}
          onSelect={onSelect(idx)}
          selected={selected.includes(idx) || result.includes(i.id)}
          isCompleted={result.includes(i.id)}
        />
      ))}
    </div>
  )
}

export const CardWrapper8 = ({
  cards,
  onSelect,
  result,
  selected,
  isFlipped,
}) => {
  const windowSize = useWindowSize()
  const size = Math.min(windowSize.width - 48, windowSize.height * 0.8, 624)
  const itemSize = size / 4 - 8
  return (
    <div
      className=' mb-2 flex aspect-square flex-row flex-wrap content-center'
      style={{ width: size, paddingLeft: itemSize / 2 }}
    >
      {cards?.map?.((i, idx) => (
        <Item
          key={`${idx}-${i.id}`}
          data={i}
          style={{ width: itemSize * 0.75, height: itemSize, margin: 4 }}
          isFlipped={isFlipped}
          onSelect={onSelect(idx)}
          selected={selected.includes(idx) || result.includes(i.id)}
          isCompleted={result.includes(i.id)}
        />
      ))}
    </div>
  )
}

export const CardWrapper10 = ({
  cards,
  onSelect,
  result,
  selected,
  isFlipped,
}) => {
  const windowSize = useWindowSize()
  const size = Math.min(windowSize.width - 48, windowSize.height * 0.8, 624)
  const itemSize = size / 5 - 8
  return (
    <div
      className=' mb-2 flex aspect-square flex-row flex-wrap content-center'
      style={{ width: size, paddingLeft: itemSize / 2 }}
    >
      {cards?.map?.((i, idx) => (
        <Item
          key={`${idx}-${i.id}`}
          data={i}
          style={{ width: itemSize * 0.75, height: itemSize, margin: 4 }}
          isFlipped={isFlipped}
          onSelect={onSelect(idx)}
          selected={selected.includes(idx) || result.includes(i.id)}
          isCompleted={result.includes(i.id)}
        />
      ))}
    </div>
  )
}

export const CardWrapper14 = ({
  cards,
  onSelect,
  result,
  selected,
  isFlipped,
}) => {
  const windowSize = useWindowSize()
  const size = Math.min(windowSize.width - 48, windowSize.height * 0.8, 624)
  const itemSize = size / 7 - 0
  return (
    <div
      className=' mb-2 flex aspect-square flex-row flex-wrap content-center'
      style={{ width: size, paddingLeft: itemSize / 2 }}
    >
      {cards?.map?.((i, idx) => (
        <Item
          key={`${idx}-${i.id}`}
          data={i}
          style={{ width: itemSize * 0.75, height: itemSize, margin: 4 }}
          isFlipped={isFlipped}
          onSelect={onSelect(idx)}
          selected={selected.includes(idx) || result.includes(i.id)}
          isCompleted={result.includes(i.id)}
        />
      ))}
    </div>
  )
}
