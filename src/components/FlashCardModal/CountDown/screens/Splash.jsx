'use client'
import React from 'react'
import Image from 'next/image'

export default function Splash({ width, height, onPageChange }) {
  return (
    <div className='relative flex flex-col'>
      <Image
        src='/img/hamburger/burger_bg.png'
        width={width}
        height={height}
        style={{ width, height, backgroundColor: '#000' }}
        className='object-contain'
      />
      <div
        onClick={() => onPageChange(1)}
        className='absolute bottom-10 z-10  cursor-pointer self-center rounded border border-2 border-red-700 bg-orange-500 px-2 py-1 text-lg text-white'
      >
        START
      </div>
    </div>
  )
}
