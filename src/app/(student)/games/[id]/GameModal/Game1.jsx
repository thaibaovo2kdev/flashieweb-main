'use client'
import React, { useEffect, memo, useState, useCallback, useRef } from 'react'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Button, Skeleton } from '@nextui-org/react'
import { IoIosArrowBack } from 'react-icons/io'
import useSound from 'use-sound'

import * as gamesAPI from '~/apis/games'
import * as flashsetAPI from '~/apis/flashsets'
import constants from '~/utils/constants'

import {
  CardWrapper2,
  CardWrapper4,
  CardWrapper6,
  CardWrapper8,
  CardWrapper10,
  CardWrapper14,
} from './components/CardWrapper'
import Image from 'next/image'

const shuffle = (arr) => {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
const colors = [
  '#E42100',
  '#03d7a4',
  '#F3BC00',
  '#6a12e5',
  '#349B19',
  '#70BBFF',
  '#7F4877',
  '#BC2A6E',
  '#222222',
  '#8c40fc',
  '#F36000',
  '#A0A226',
  '#0570b7',
  '#01b5bf',
  '#7F4877',
  '#BC2A6E',
  '#222222',
  '#8c40fc',
  '#F36000',
  '#A0A226',
  '#0570b7',
  '#01b5bf',
]

export default function Scene({ scene, scenes, onClose }) {
  const { gameId } = scene
  const [playFlipcard] = useSound('/sound/flipcard.mp3')
  const [playSuccess] = useSound('/sound/success.mp3')
  const [playWrong] = useSound('/sound/wrong.mp3')
  const [playCompleted] = useSound('/sound/scene_completed.mp3')

  // const windowSize = useWindowSize([])
  const [cards, setCard] = useState([])
  const [sceneId, setSceneId] = useState(scene.sceneId)
  const [result, setResult] = useState([])
  const [wrongs, setWrongs] = useState(0)
  const [isCompleted, setIsCompletd] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  const [selected, setSelected] = useState([])
  const histories = useRef({})
  console.log(scenes, 'scenes', sceneId)
  const scenecards = useQuery({
    queryKey: ['scene-cards', gameId, sceneId],
    queryFn: () => gamesAPI.cardsOfScene(gameId, sceneId),
  })

  // useEffect(() => {
  //   return () => {
  //     flashsetAPI.histories(
  //       `${gameId}-${sceneId}`,
  //       'game',
  //       Object.keys(histories.current).map((i) => ({
  //         id: i,
  //         result: histories.current[i],
  //       }))
  //     )
  //   }
  // }, [])

  useEffect(() => {
    if (scenecards.data?.length > 0 && cards.length === 0) {
      const _cards = scenecards.data.map((i, idx) => ({
        ...i,
        color: colors[idx],
      }))
      const _backCards = _cards.map((i, idx) => ({
        ...i,
        frontImage: i.backImage,
        frontText: i.backText,
        backText: i.frontText,
        backImage: i.frontImage,
      }))
      setCard(shuffle([..._cards, ..._backCards]))
    }
  }, [scenecards])

  useEffect(() => {
    if (selected.length > 1) {
      if (cards[selected[0]].id === cards[selected[1]].id) {
        playSuccess()
        setResult((s) => [...s, cards[selected[0]].id])
        setSelected([])
        histories.current[cards[selected[0]].id] = true
      } else {
        playWrong()
        setWrongs((s) => s + 1)
        setTimeout(() => {
          setSelected([])
        }, 1000)
        histories.current[cards[selected[0]].id] = false
      }
    }
    if (cards.length / 2 === result.length && result.length > 0) {
      setTimeout(() => {
        setIsCompletd(true)
        playCompleted()
      }, 2000)
    }
  }, [selected])

  const setHistory = () => {
    const his = Object.keys(histories.current)
    if (his.length === 0) return
    flashsetAPI
      .histories(
        `${gameId}-${sceneId}`,
        'game',
        his.map((i) => ({
          id: i,
          result: histories.current[i],
        }))
      )
      .then(() => {
        histories.current = {}
      })
  }

  const handleSelect = (idx) => () => {
    setSelected((s) => {
      if (s.length >= 2) return s
      playFlipcard()
      return [...s, idx]
    })
  }

  const handleContinue = () => {
    const idx = scenes.findIndex((i) => i.sceneId === sceneId)
    if (idx > -1) {
      setHistory()
      setIsCompletd(false)
      setResult([])
      setSelected([])
      setWrongs(0)
      setCard([])
      setSceneId(scenes[idx + 1].sceneId)
    }
  }

  const handleClose = () => {
    setHistory()
    onClose?.()
  }

  if (scenecards.isLoading) {
    return (
      <div className='flex flex-col'>
        <div className='flex flex-row justify-between'>
          <Link href='/'>
            <IoIosArrowBack size={24} />
          </Link>
          <p>Game</p>
          <div className='w-6' />
        </div>
        <div className='mt-4 grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5'>
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
          <Skeleton className='aspect-square rounded-lg' />
        </div>
      </div>
    )
  }

  return (
    <div className='relative my-4 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl'>
      {cards.length === 4 && (
        <CardWrapper2
          cards={cards}
          selected={selected}
          result={result}
          onSelect={handleSelect}
        />
      )}
      {cards.length === 12 && (
        <CardWrapper6
          cards={cards}
          selected={selected}
          result={result}
          onSelect={handleSelect}
        />
      )}
      {cards.length === 8 && (
        <CardWrapper4
          cards={cards}
          selected={selected}
          result={result}
          onSelect={handleSelect}
        />
      )}
      {cards.length === 16 && (
        <CardWrapper8
          cards={cards}
          selected={selected}
          result={result}
          onSelect={handleSelect}
        />
      )}
      {cards.length === 20 && (
        <CardWrapper10
          cards={cards}
          selected={selected}
          result={result}
          onSelect={handleSelect}
        />
      )}
      {cards.length === 28 && (
        <CardWrapper14
          cards={cards}
          selected={selected}
          result={result}
          onSelect={handleSelect}
        />
      )}

      {isCompleted && (
        <div className='absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.7)]'>
          <span className='mb-4  text-center text-5xl font-bold text-green-500'>
            {constants.label_game_finished}
          </span>
          <div className='flex flex-row gap-4'>
            <span className='mb-4 text-lg font-bold text-green-300'>
              {constants.label_game_point} : {result.length * 3}
            </span>
            <span className='mb-4 text-lg font-bold text-green-300'>
              {/* Số câu đúng: {result.length - wrongs} */}
            </span>
          </div>
          <div className='flex flex-row gap-4'>
            <Button onPress={handleClose}>CLOSE</Button>
            {scenes?.length > parseInt(sceneId) && (
              <Button onPress={handleContinue} color='primary'>
                CONTINUE
              </Button>
            )}
          </div>
        </div>
      )}

      {showWelcome && (
        <div
          className='absolute bottom-4 left-0 right-0 top-0 flex cursor-pointer flex-col justify-center bg-white'
          onClick={() => setShowWelcome(false)}
        >
          <Image
            src='/img/matchflash_banner.png'
            width={800}
            height={800}
            className='h-auto w-full rounded-3xl'
          />
        </div>
      )}
    </div>
  )
}
