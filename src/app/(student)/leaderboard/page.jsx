'use client'
import React, { useState } from 'react'
import { TbUsersGroup } from 'react-icons/tb'
import { GiGamepadCross } from 'react-icons/gi'
import { ImBooks } from 'react-icons/im'
import { useQuery } from '@tanstack/react-query'

import * as leaderboardAPI from '~/apis/leaderboard'
import { FaCrown } from 'react-icons/fa'
import { RiMapPinUserFill } from 'react-icons/ri'
import { Spinner } from '@nextui-org/react'

export default function Page() {
  const [selected, setSelected] = useState('community')
  const leaderboard = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardAPI.getLeaderboard(),
  })

  const handleSelect = (key) => () => {
    setSelected(key)
  }

  return (
    <div className='flex flex-col py-6'>
      <div className='flow-row relative  flex h-24 gap-4 rounded-full border-4 border-[#5E9DD0] bg-[#CDEDFB] p-2'>
        <div
          onClick={handleSelect('community')}
          className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-full ${
            selected === 'community'
              ? 'bg-[#5E9DD0] text-white'
              : 'bg-transparent text-black'
          }`}
        >
          <TbUsersGroup size={30} />
          <p className='text-sm md:text-lg'>Community</p>
        </div>

        <div
          onClick={handleSelect('game')}
          className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-full ${
            selected === 'game'
              ? 'bg-[#5E9DD0] text-white'
              : 'bg-transparent text-black'
          }`}
        >
          <GiGamepadCross size={30} />
          <p className='text-sm md:text-lg'>Mini game</p>
        </div>
        <div
          onClick={handleSelect('course')}
          className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-full ${
            selected === 'course'
              ? 'bg-[#5E9DD0] text-white'
              : 'bg-transparent text-black'
          }`}
        >
          <ImBooks size={30} />
          <p className='text-sm md:text-lg'>Courses</p>
        </div>
      </div>

      {selected !== 'course' && (
        <div className='my-8 rounded-2xl border-4 border-[#1D365D] bg-[#FCC27C] p-4'>
          <div className='flow-row flex text-lg font-semibold'>
            <span className='w-14 text-center'>No.</span>
            <span className='flex flex-1'>Student name</span>
            <span className='w-14'>Point</span>
          </div>
          {leaderboard.isLoading && (
            <div className='flex flex-col items-center justify-center'>
              <Spinner />
              <p>Loading...</p>
            </div>
          )}
          {leaderboard?.data?.[selected]?.map?.((i) => {
            return (
              <div
                key={i.id}
                className='flow-row text-md mt-4 flex font-medium'
              >
                <span className='w-14 text-center'>{i.rank}</span>
                <span className='flex flex-1'>
                  {i.name}{' '}
                  {i.rank === 1 && <FaCrown size={20} className='ml-1' />}{' '}
                  {i.me && <RiMapPinUserFill size={20} className='ml-1' />}
                </span>
                <span className='w-14 text-center'>{i.score}</span>
              </div>
            )
          })}
        </div>
      )}

      {selected === 'course' && (
        <div className='my-8 rounded-2xl border-4 border-[#1D365D] bg-[#FCC27C] p-4'>
          <div className='flow-row flex text-lg font-semibold'>
            <span className='w-14 text-center'>No.</span>
            <span className='flex flex-1'>Student name</span>
            <span className='w-14'>Point</span>
          </div>
          {leaderboard.isLoading && (
            <div className='flex flex-col items-center justify-center'>
              <Spinner />
              <p>Loading...</p>
            </div>
          )}
          {leaderboard?.data?.[selected]?.length == 0 && (
            <p className='m-4'>No data to display</p>
          )}
          {leaderboard?.data?.[selected]?.map?.((course) => {
            return (
              <div key={course.id} className='mt-8'>
                <p className='mb-1 ml-4 text-xl font-bold'>{course.name}</p>
                <div className='rounded-2xl border-4 border-[#1D365D] bg-[#FCC27C] p-4'>
                  <div className='flow-row flex text-lg font-semibold'>
                    <span className='w-14 text-center'>No.</span>
                    <span className='flex flex-1'>Student name</span>
                    <span className='w-14'>Point</span>
                  </div>
                  {/* {course?.ranks?.length == 0 && (
                    <p className='m-4'>No data to display</p>
                  )} */}
                  {course?.ranks?.map?.((i) => {
                    return (
                      <div
                        key={i.id}
                        className='flow-row text-md mt-4 flex font-medium'
                      >
                        <span className='w-14 text-center'>{i.rank}</span>
                        <span className='flex flex-1'>
                          {i.name}{' '}
                          {i.rank === 1 && (
                            <FaCrown size={20} className='ml-1' />
                          )}{' '}
                          {i.me && (
                            <RiMapPinUserFill size={20} className='ml-1' />
                          )}
                        </span>
                        <span className='w-14 text-center'>{i.score}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
