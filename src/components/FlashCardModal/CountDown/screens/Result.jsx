'use client'
import React, { useEffect, useState } from 'react'

export default function Result({ width, height, result, heart, onPageChange }) {
  const [feel, setFeel] = useState(heart < 3 ? 'sad' : 'happy')
  const [score, setScore] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      // let _score = 0
      // if (Array.isArray(result)) {
      //   result.forEach((i) => {
      //     if (i) _score += 10
      //   })
      // }
      console.log(result)
      // if (heart < 3) setFeel('sad')
      // else setFeel('happy')
      setScore(result.length * 10)
    }, 1000)
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
      {feel.length > 0 && (
        <img
          src={`/img/hamburger/monster_${feel}.png`}
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
      )}

      {score !== null && (
        <div
          style={{
            width: 80,
            height: 60,
            position: 'absolute',
            top: 4,
            alignSelf: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={'/img/hamburger/heart.png'}
            alt='hamburger'
            style={{
              width: 80,
              height: 70,
              position: 'absolute',
              top: 0,
              left: 0,
              objectFit: 'fill',
            }}
          />
          <span
            style={{
              color: '#fff',
              position: 'absolute',
              fontWeight: '500',
              marginTop: 8,
            }}
          >
            {score}
          </span>
        </div>
      )}

      {feel.length > 0 && (
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
            {feel === 'sad' ? 'Click to retry!' : 'Click to replay!'}
          </span>
        </div>
      )}
    </div>
  )
}
