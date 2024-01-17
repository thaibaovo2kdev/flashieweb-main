'use client'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Spinner,
} from '@nextui-org/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useRef, useEffect } from 'react'

import * as courseAPI from '~/apis/courses'
import Quiz from './Quiz'

export default function QuizModal({ children, courseId, flashsetId }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [perPage, setPerPage] = useState(20)
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const isFirst = useRef(true)

  const cards = useQuery({
    enabled: isOpen,
    queryKey: ['course-quiz', courseId, flashsetId, page, perPage],
    queryFn: () => courseAPI.getQuiz(courseId, flashsetId, { page, perPage }),
  })

  useEffect(() => {
    if (!isOpen && !isFirst.current) {
      queryClient.refetchQueries(['flashset', flashsetId])
    }
    isFirst.current = false
  }, [isOpen])

  return (
    <>
      <div className='relative cursor-pointer' onClick={onOpen}>
        {children}
        <div className='absolute bottom-0 left-0 right-0 top-0' />
      </div>
      {isOpen && (
        <Modal size='full' isOpen={true} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Quiz</ModalHeader>
                <ModalBody>
                  {cards.isLoading ? (
                    <div className='flex h-80 w-full flex-col items-center justify-center'>
                      <Spinner size={60} />
                    </div>
                  ) : (
                    <Quiz
                      cards={cards?.data?.data}
                      flashsetId={flashsetId}
                      onClose={onClose}
                    />
                  )}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
