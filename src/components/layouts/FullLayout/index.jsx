'use client'
import Navbar from '../Navbar'

export default function PageLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className='item relative flex h-full w-full flex-col'>
        <img
          src='/img/bg.png'
          alt='BG'
          className='absolute bottom-0 left-0 right-0 top-0 z-0 h-screen w-screen  object-cover'
        />
        <div className='z-10 w-full max-w-5xl flex-col self-center'>
          {children}
        </div>
      </div>
    </>
  )
}
