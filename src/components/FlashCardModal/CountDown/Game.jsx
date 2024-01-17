'use client'
import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import Splash from './screens/Splash'
import Home from './screens/Home'
import Play from './screens/Play'
import GameOver from './screens/GameOver'
import Result from './screens/Result'
import Animation from './screens/Animation'

export default function GamePlay(props) {
  const screens = useRef([Splash, Home, Play, GameOver, Animation, Result])
  const [screenIdx, setScreenIndex] = useState(0)
  const result = useRef([])
  const heart = useRef(3)
  const bgSound = useRef(new Audio('/sound/hamburger_game_bg.mp3'))

  const [perPage, setPerPage] = useState(props.perPage)
  const [page, setPage] = useState(props.page)

  useEffect(() => {
    return () => {
      bgSound.current?.pause?.()
    }
  }, [])

  useEffect(() => {
    if (screenIdx == 1) {
      result.current = []
      heart.current = 3
      bgSound.current.volume = 0.1
      bgSound.current.loop = true
      bgSound.current?.play?.()
    }
    if (screenIdx === 2) {
      result.current = []
      heart.current = 3
    }
  }, [screenIdx])

  const cards = props.cards.slice(page * perPage - perPage, perPage)

  const Screen = screens.current[screenIdx]
  return (
    <Screen
      {...props}
      cards={cards}
      result={result.current}
      heart={heart.current}
      onPageChange={setScreenIndex}
      onNext={() => {
        setPage((s) => s + 1)
        setScreenIndex(2)
      }}
      onResult={(res) => (result.current = res)}
      onHeart={(res) => (heart.current = res)}
    />
  )
}
