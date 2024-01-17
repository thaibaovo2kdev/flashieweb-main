'use client'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Spinner,
  Button,
} from '@nextui-org/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6'
import { isDesktop } from 'react-device-detect'

import Cards from '../components/Cards'

import * as flashsetAPI from '~/apis/flashsets'
import { alert } from '~/utils/helpers'

export default function Learn({
  children,
  flashsetId,
  page,
  perPage,
  learned,
}) {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const [perPage, setPerPage] = useState(5)
  // const [page, setPage] = useState(initPage)
  const refCards = useRef()
  const refBody = useRef(new Date().getTime())
  const [index, setIndex] = useState(learned || 0)
  const isFirst = useRef(true)
  const isFlipped = useRef(false)
  const isListen = useRef(false)

  const cards = useQuery({
    enabled: isOpen,
    queryKey: ['flashset-cards', flashsetId, page, perPage],
    queryFn: () =>
      flashsetAPI.getFlashcards({ id: flashsetId, page, perPage: 1000 }),
  })
  console.log(learned, 'learned')
  const handleFlip = (flashcardId) => {
    console.log('handleFlip')
    refBody.current = new Date().getTime()
    isFlipped.current = true
    flashsetAPI
      .histories(flashsetId, 'learn', [{ id: flashcardId, result: true }])
      .then(() => {
        // queryClient.refetchQueries(['flashset', flashsetId])
      })
  }

  useEffect(() => {
    if (!isOpen && !isFirst.current) {
      setIndex(learned || 0)
      queryClient.refetchQueries(['flashset', flashsetId])
    }
    isFirst.current = false
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keyup', handleKeyPress)
    }
    return () => {
      isOpen && window.removeEventListener('keyup', handleKeyPress)
    }
  }, [isOpen])

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowRight') handleNext()
    else if (e.key === 'ArrowLeft') handlePrev()
  }

  const handlePrev = () => refCards.current.prev()
  const handleNext = () => {
    console.log(isFlipped.current, '1 isFlipped.current')
    if (!isFlipped.current) {
      alert.error('Please try flipping this card first')
      return
    }
    isListen.current = false

    isFlipped.current = false
    refCards.current.next()
    console.log(isFlipped.current, '2 isFlipped.current')
  }

  const isMobile = () =>
    window?.matchMedia && window?.matchMedia?.('(max-width: 768px)')?.matches

  const handeBody = () => {
    if (!isMobile() || isDesktop) return
    if (new Date().getTime() - refBody.current < 1000) return
    console.log('object', isFlipped.current)
    handleNext()
  }

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
                <ModalHeader className='flex flex-col gap-1'>Learn</ModalHeader>
                <ModalBody onClick={handeBody}>
                  {cards.isLoading && (
                    <div className='flex h-80 w-full flex-col items-center justify-center'>
                      <Spinner size={60} />
                    </div>
                  )}
                  {Array.isArray(cards?.data?.data) && (
                    <Cards
                      ref={refCards}
                      flashsetId={flashsetId}
                      data={cards?.data.data}
                      onClose={onClose}
                      onFlip={handleFlip}
                      onSpeaked={() => {
                        isListen.current = true
                      }}
                      onIndexChange={setIndex}
                      onNext={() => {}}
                      // onOutideClick={handleNext}
                    />
                  )}

                  {Array.isArray(cards?.data?.data) && (
                    <div className='flex flex-row items-center justify-between p-4 font-semibold'>
                      <Button
                        // isDisabled={index <= 0}
                        color='primary'
                        isIconOnly
                        variant='light'
                        onPress={handlePrev}
                      >
                        <FaCircleChevronLeft size={30} />
                      </Button>
                      <p>
                        {Math.min(index + 1, cards?.data.data.length)}/
                        {cards?.data?.data?.length}
                      </p>
                      {cards?.data?.data?.length - index === 0 ? (
                        <Button color='success' onPress={onClose}>
                          Done
                        </Button>
                      ) : (
                        <Button
                          isDisabled={cards?.data?.data?.length - index === 0}
                          color='primary'
                          isIconOnly
                          variant='light'
                          onPress={handleNext}
                        >
                          <FaCircleChevronRight size={30} />
                        </Button>
                      )}
                    </div>
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
