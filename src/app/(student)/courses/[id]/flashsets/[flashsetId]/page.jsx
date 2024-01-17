'use client'
import { IoIosArrowBack } from 'react-icons/io'
import LearnModal from '~/components/FlashCardModal/Learn'
import CountDownModal from '~/components/FlashCardModal/CountDown'
import QuizModal from '~/components/FlashCardModal/Quiz'
import Dictation from '~/components/FlashCardModal/Dictation'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { Button, Skeleton } from '@nextui-org/react'
import Link from 'next/link'
import Bookmark from '~/components/Bookmark'

import * as flashsetsAPI from '~/apis/flashsets'
import * as courseAPI from '~/apis/courses'
import constants from '~/utils/constants'

const Flashset = (props) => {
  const searchParams = useSearchParams()
  const { id, flashsetId } = useParams()
  const router = useRouter()
  const flashset = useQuery({
    queryKey: ['flashset', flashsetId],
    queryFn: () => flashsetsAPI.getFlashsetById(flashsetId),
  })
  const quiz = useQuery({
    queryKey: ['course-quiz', id, flashsetId],
    queryFn: () => courseAPI.getQuiz(id, flashsetId, { page: 1, perPage: 20 }),
  })

  if (flashset.isLoading)
    return (
      <div className='w-full space-y-5 p-4' radius='lg'>
        <Skeleton className='rounded-lg'>
          <div className='h-80 rounded-lg bg-default-300'></div>
        </Skeleton>
        <div className='space-y-3'>
          <Skeleton className='w-3/5 rounded-lg'>
            <div className='h-3 w-3/5 rounded-lg bg-default-200'></div>
          </Skeleton>
          <Skeleton className='w-4/5 rounded-lg'>
            <div className='h-3 w-4/5 rounded-lg bg-default-200'></div>
          </Skeleton>
          <Skeleton className='w-2/5 rounded-lg'>
            <div className='h-3 w-2/5 rounded-lg bg-default-300'></div>
          </Skeleton>
        </div>
      </div>
    )

  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-row justify-between'>
        {searchParams.get('isBack') != 'false' && (
          <Button onPress={router.back} isIconOnly variant='light'>
            <IoIosArrowBack size={24} />
          </Button>
        )}
        <p>{flashset?.data?.name}</p>
        <Bookmark
          isBookmark={flashset?.data.isBookmark}
          parentType='flashset'
          parentId={flashset?.data.id}
          size={18}
        />
      </div>
      <Image
        className='mt-4 aspect-square h-auto w-full rounded-lg'
        width={100}
        height={80}
        src={flashset.data.image}
      />
      <div className='mt-4 flex flex-row items-center justify-between'>
        <p>{constants.label_course_flashset_learn}</p>
        <div className='flex flex-row items-center gap-2'>
          <LearnModal
            perPage={20}
            page={Math.ceil((flashset.data.learned + 1) / 20)}
            learned={flashset.data.learned}
            flashsetId={flashsetId}
          >
            <Button size='sm' color='primary'>
              Start
            </Button>
          </LearnModal>
          <p className='w-16 text-right'>
            {flashset.data.learned}/{flashset.data.totalCards}
          </p>
        </div>
      </div>
      <div className='mt-4 flex flex-row items-center justify-between'>
        <p>{constants.label_course_flashset_feature_2}</p>
        <div className='flex flex-row items-center gap-2'>
          <CountDownModal
            flashsetId={flashsetId}
            perPage={21}
            page={Math.ceil((flashset.data.countdown + 1) / 21)}
          >
            <Button size='sm' color='primary'>
              Start
            </Button>
          </CountDownModal>
          <p className='w-16 text-right'>
            {flashset.data.hamburger.completed}/{flashset.data.hamburger.total}
          </p>
        </div>
      </div>

      <div className='mt-4 flex flex-row items-center justify-between'>
        <p>{constants.label_course_flashset_feature_3}</p>
        <div className='flex flex-row items-center gap-2'>
          <Dictation
            flashsetId={flashsetId}
            perPage={20}
            page={Math.ceil((flashset.data.dictation + 1) / 20)}
          >
            <Button size='sm' color='primary'>
              Start
            </Button>
          </Dictation>
          <p className='w-16 text-right'>
            {flashset.data.dictation}/{flashset.data.totalCards}
          </p>
        </div>
      </div>
      {/* <LearnModal
        flashsetId={flashsetId}
        perPage={20}
        page={Math.ceil((flashset.data.learned + 1) / 20)}
      >
        <div className='mt-4 flex flex-row justify-between'>
          <p>{constants.label_course_flashset_learn}</p>
          <p>
            {flashset.data.learned}/{flashset.data.totalCards}
          </p>
        </div>
      </LearnModal> */}
      {/* <CountDownModal
        flashsetId={flashsetId}
        perPage={21}
        page={Math.ceil((flashset.data.countdown + 1) / 21)}
      >
        <div className='mt-4 flex flex-row justify-between'>
          <p>{constants.label_course_flashset_feature_2}</p>
          <p>
            {flashset.data.hamburger.completed}/{flashset.data.hamburger.total}
          </p>
        </div>
      </CountDownModal>

      <Dictation
        flashsetId={flashsetId}
        perPage={20}
        page={Math.ceil((flashset.data.dictation + 1) / 20)}
      >
        <div className='mt-4 flex flex-row justify-between'>
          <p>{constants.label_course_flashset_feature_3}</p>
          <p>
            {flashset.data.dictation}/{flashset.data.totalCards}
          </p>
        </div>
      </Dictation> */}
      {quiz?.data?.total > 0 && (
        <div className='mt-4 flex flex-row items-center justify-between'>
          <p>{constants.label_course_flashset_feature_4}</p>
          <div className='flex flex-row items-center gap-2'>
            <QuizModal
              courseId={id}
              flashsetId={flashsetId}
              perPage={20}
              page={Math.ceil((flashset.data.quiz + 1) / 20)}
            >
              <Button size='sm' color='primary'>
                Start
              </Button>
            </QuizModal>
            <p className='w-16 text-right'>
              {flashset.data.quiz}/{quiz?.data?.total}
            </p>
          </div>
        </div>
      )}
      {/* <div className='mt-4 flex flex-row justify-between'>
        <p>ReQuiz</p>
        <p>18/60</p>
      </div> */}
    </div>
  )
}

export default Flashset
