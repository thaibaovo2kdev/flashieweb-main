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

export default function LearnModal({ children }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { id } = useParams()

  const [perPage, setPerPage] = useState(200)
  const [page, setPage] = useState(1)
  const [idx, setIdx] = useState(0)
  // const [total, setTotal] = useState(0)
  // const [arrImg, setArrImg] = useState([])

  // const imagesOfCard = useRef([])

  // const [answers, setAnswers] = useState(new Array(4))

  const cards = useQuery({
    enabled: isOpen,
    queryKey: ['flashset-cards', id, page, perPage],
    queryFn: () =>
      flashsetsAPI.getFlashcards({ id, page, perPage }).then((res) => {
        // setTotal(res.data?.length)
        // imagesOfCard.current = res?.data?.reduce((p, n) => {
        //   if (n.frontImage && n.backImage) {
        //     p.push(n.frontImage, n.backImage)
        //   }
        //   if (n.frontImage) {
        //     p.push(n.frontImage)
        //   }
        //   if (n.backImage) {
        //     p.push(n.frontImage)
        //   }
        //   return [...p]
        // }, [])
        // setIdx(0)
        return res.data
      }),
  })

  // useEffect(() => {
  //   if (idx > -1) {
  //     const randomImgs = shuffle(imagesOfCard.current)

  //     const answers = randomImgs.slice(0, 3)
  //     answers.push(cards?.data?.[idx]?.backImage)
  //     setAnswers(shuffle(answers))
  //   }
  // }, [idx])

  // const changeIdx = (link) => () => {
  //   if (link === cards?.data?.[idx]?.backImage) {
  //     alert.success('Correct answer')
  //   } else {
  //     alert.error('Wrong answer')
  //   }
  //   setIdx((s) => s + 1)
  // }
  // console.log(cards.isLoading, cards.data, id)
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
                {cards.isLoading ? (
                  <div className='flex h-80 w-full flex-col items-center justify-center'>
                    <Spinner size={60} />
                  </div>
                ) : (
                  <Cards flashsetId={id} data={cards?.data} onClose={onClose} />
                )}
                {/* {idx > -1 <Cards flashsetId={id} data={cards?.data} onClose={onClose} />} */}
              </ModalBody>
              {/* <ModalFooter className='items-center justify-between font-semibold'>
                <Button
                  isDisabled={idx <= 0}
                  color='primary'
                  isIconOnly
                  variant='light'
                  onPress={() => setIdx((i) => i - 1)}
                >
                  <FaCircleChevronLeft size={30} />
                </Button>
                <p>
                  {idx + 1}/{total}
                </p>
                <Button
                  isDisabled={total - idx <= 1}
                  color='primary'
                  isIconOnly
                  variant='light'
                  onPress={() => setIdx((i) => i + 1)}
                >
                  <FaCircleChevronRight size={30} />
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
