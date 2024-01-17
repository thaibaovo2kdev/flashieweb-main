'use client'
import React, { useEffect, useRef } from 'react'

export default function Home({ width, height, onPageChange }) {
  let i = 0
  let txt =
    'There was a giant Monster King in Andromeda galaxy. However, he was hit by a meteor shower and shrunk down. Save him with a hamburger!'
  let speed = 50

  const typingSound = useRef(new Audio('/img/hamburger/type-writing.mp3'))
  const canClick = useRef(false)
  const timeout = useRef()

  useEffect(() => {
    return () => {
      typingSound.current?.pause?.()
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  const typeWriter = () => {
    if (i < txt.length) {
      document.getElementById('intro_text').innerHTML += txt.charAt(i)
      i++
      timeout.current = setTimeout(typeWriter, speed)
    } else {
      typingSound.current.pause()
      canClick.current = true
    }
  }
  return (
    <div
      className='relative flex cursor-pointer flex-col '
      style={{ width, height }}
      onClick={() => (canClick.current ? onPageChange(2) : {})}
    >
      <img
        src='/img/hamburger/chocokobato_galactic_background.png'
        alt='hamburger'
        style={{ width, height }}
        className='object-fill'
      />
      <img
        src='/img/hamburger/monster.gif'
        alt='hamburger'
        onLoad={() => {
          typeWriter()
          typingSound.current.play()
        }}
        style={{
          width: width * 0.6,
          height: height,
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          objectFit: 'fill',
        }}
      />
      <div
        style={{
          width: width * 0.65,
          height: height * 0.3,
          alignSelf: 'center',
          position: 'absolute',
          bottom: 35,
        }}
      >
        <img
          src='/img/hamburger/laula.png'
          alt='laula'
          style={{
            width: height * 0.15,
            height: height * 0.17,
            objectFit: 'fill',
            position: 'absolute',
            left: 0,
            bottom: 0,
          }}
        />
        <div
          style={{
            width: width * 0.5,
            height: height * 0.3,
            position: 'absolute',
            left: height * 0.13,
            bottom: 0,
            alignSelf: 'center',
            objectFit: 'fill',
          }}
        >
          <img
            src='/img/hamburger/home_intro.png'
            alt='hamburger'
            style={{
              width: width * 0.5,
              height: height * 0.3,
              position: 'absolute',
              left: 0,
              bottom: 0,
              top: 0,
              right: 0,
              alignSelf: 'center',
              objectFit: 'fill',
            }}
          />
          <span
            id='intro_text'
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              bottom: 16,
              right: 16,
              fontSize: 18,
              fontWeight: '500',
            }}
          ></span>
        </div>

        <img
          src='/img/hamburger/laula.png'
          alt='laula'
          style={{
            width: height * 0.15,
            height: height * 0.17,
            objectFit: 'fill',
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
        />
      </div>
    </div>
  )
}
