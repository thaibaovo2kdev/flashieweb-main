'use client'
import React, { useEffect, useRef } from 'react'
import useSound from 'use-sound'

export default function GameOver({ width, height, onPageChange }) {
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
        src='/img/hamburger/monster_sad.png'
        alt='hamburger'
        style={{
          width: height * 0.8,
          height: height * 0.8,
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          objectFit: 'fill',
        }}
      />

      <span
        style={{
          position: 'absolute',
          top: 16,
          alignSelf: 'center',
          fontSize: 50,
          color: '#fff',
        }}
      >
        GAME OVER
      </span>

      <div
        style={{
          width: width * 0.3,
          height: height * 0.2,
          position: 'absolute',
          bottom: height * 0.1,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
        onClick={() => onPageChange(2)}
      >
        <img
          src='/img/hamburger/home_intro.png'
          alt='hamburger'
          style={{
            width: width * 0.3,
            height: height * 0.2,
            position: 'absolute',
            left: 0,
            bottom: 0,
            top: 0,
            right: 0,
            zIndex: 0,
          }}
        />
        <span
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#222',
            zIndex: 1,
          }}
        >
          Click to retry!
        </span>
      </div>
    </div>
  )
}
