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

import * as flashsetAPI from '~/apis/flashsets'
import Dictation from './Dictation'
import { useEffect, useRef, useState } from 'react'

export default function PlayCountdownModal({
  children,
  flashsetId,
  page,
  perPage,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const queryClient = useQueryClient()
  const isFirst = useRef(true)
  const [_page, setPage] = useState(page)

  const cards = useQuery({
    enabled: isOpen,
    queryKey: ['flashset-cards', flashsetId, page, perPage],
    queryFn: () =>
      flashsetAPI.getFlashcards({ id: flashsetId, page: _page, perPage }),
  })

  useEffect(() => {
    // console.log(isOpen, 'pagepageisOpenisOpen')
    if (!isOpen && !isFirst.current)
      queryClient.refetchQueries(['flashset', flashsetId])
    isFirst.current = false
  }, [isOpen])

  return (
    <>
      <div className='relative cursor-pointer' onClick={onOpen}>
        {children}
        <div className='absolute bottom-0 left-0 right-0 top-0' />
      </div>
      {isOpen && (
        <Modal size='md' isDismissable={false} isOpen={true} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Dictation
                </ModalHeader>
                <ModalBody>
                  {cards.isLoading ? (
                    <div className='flex h-80 w-full flex-col items-center justify-center'>
                      <Spinner size={60} />
                    </div>
                  ) : (
                    <Dictation
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
