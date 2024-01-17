'use client'
import React, { useEffect, memo, useState, useCallback, useRef } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from '@nextui-org/react'
import * as flashsetsAPI from '~/apis/flashsets'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { shuffle } from '~/utils/helpers'
import Cards from './Cards'

export default function CountDownModal({ children }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { id } = useParams()

  const [perPage, setPerPage] = useState(200)
  const [page, setPage] = useState(1)
  const [idx, setIdx] = useState(-1)
  const [total, setTotal] = useState(0)
  const [arrImg, setArrImg] = useState([])

  const imagesOfCard = useRef([])

  const cards = useQuery({
    enabled: isOpen,
    queryKey: ['flashset-cards', id, page, perPage],
    queryFn: () =>
      flashsetsAPI.getFlashcards({ id, page, perPage }).then((res) => {
        setTotal(res.data?.length)
        setIdx(0)
        return res.data
      }),
  })

  useEffect(() => {
    if (idx > -1) {
      const randomImgs = shuffle(imagesOfCard.current)

      const answers = randomImgs.slice(0, 3)
      answers.push(cards?.data?.[idx]?.backImage)
    }
  }, [idx])

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal
        isOpen={isOpen}
        size='5xl'
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'></ModalHeader>
              <ModalBody>
                {cards.isLoading && (
                  <div className='flex h-80 w-full flex-col items-center justify-center'>
                    <Spinner size={60} />
                  </div>
                )}
                {idx > -1 && <Cards data={cards?.data} />}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
