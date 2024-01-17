'use client'
import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import useSound from 'use-sound'

export default function Result({ width, height, result, onPageChange }) {
  // const [playEatingSound, { stop }] = useSound('/sound/eating-sound.mp3')
  const eatingSound = useRef(new Audio('/sound/eating-sound.mp3'))
  const completed = useRef(false)
  const items = useRef(
    [
      { width: 64, height: 64, left: width * 0.18, top: height * 0.35 },
      { width: 60, height: 60, left: width * 0.8, top: height * 0.42 },
      { width: 56, height: 56, left: width * 0.15, top: height * 0.72 },
      { width: 48, height: 48, left: width * 0.85, top: height * 0.27 },
      { width: 40, height: 40, left: width * 0.1, top: height * 0.52 },
      { width: 50, height: 50, left: width * 0.78, top: height * 0.76 },
      { width: 46, height: 46, left: width * 0.12, top: height * 0.17 },
      { width: 50, height: 50, left: width * 0.68, top: height * 0.16 },
      { width: 50, height: 50, left: width * 0.18, top: height * 0.13 },
      { width: 58, height: 58, left: width * 0.88, top: height * 0.66 },
    ].slice(0, Math.min(result.length, 10))
  )
  const isEmpty = items.current.length === 0
  if (items.current.length === 0) {
    items.current = [
      { width: 64, height: 64, left: width * 0.18, top: height * 0.35 },
    ]
  }

  useEffect(() => {
    new Audio(`/sound/shake-popcorn.mp3`).play()
  }, [])

  return (
    <div
      className='relative flex cursor-pointer flex-col '
      style={{ width, height }}
    >
      <img
        src='/img/hamburger/chocokobato_galactic_background.png'
        alt='hamburger'
        style={{ width, height }}
        className='object-fill'
      />
      <img
        id='monster'
        src={'/img/hamburger/monster.gif'}
        alt='hamburger'
        style={{
          width: width * 0.6,
          height: height,
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          objectFit: 'fill',
        }}
      />

      {items.current.map((i, idx) => (
        <motion.div
          key={idx}
          animate={{
            scale: [1, 1, 1.5, 0.5, 0],
            rotate: [
              -3, 2, -2, 3, -2, 3, -4, 2, -1, 3, -2, 0, -3, 2, -2, 3, -2, 3, -4,
              2, -1, 3, -2, 0,
            ],
            x: [0, 0, 0, width * 0.5 - i.left - i.width * 0.5],
            y: [0, 0, 0, height * 0.5 - i.top - i.width * 0.5],
            transition: { duration: 4 },
          }}
          onAnimationComplete={() => {
            if (completed.current) return
            completed.current = true
            const monster = document.getElementById('monster')
            if (monster) monster.src = '/img/hamburger/monster-chew.gif'
            eatingSound.current?.play?.()
            setTimeout(() => {
              eatingSound.current?.pause?.()
              onPageChange(5)
            }, 3000)
          }}
          style={{
            width: i.width,
            height: i.height,
            left: i.left,
            top: i.top,
            position: 'absolute',
          }}
        >
          {!isEmpty && (
            <img
              src='/img/hamburger/burger.png'
              alt='hamburger'
              style={{
                width: i.width,
                height: i.height,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
