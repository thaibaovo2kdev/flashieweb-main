'use client'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react'
import { useEffect, useRef } from 'react'

import Game1 from './Game1'
import Game2 from './Game2'

export default function App({ children, scene, scenes, game, onClose }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const isFirst = useRef(true)

  useEffect(() => {
    if (!isOpen && !isFirst.current) onClose()
    isFirst.current = false
  }, [isOpen])

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      {isOpen && (
        <Modal
          isOpen={true}
          onOpenChange={onOpenChange}
          size='2xl'
          isDismissable={false}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'></ModalHeader>
                <ModalBody>
                  {game.type === 'matching1' ? (
                    <Game1 scene={scene} scenes={scenes} onClose={onClose} />
                  ) : (
                    <Game2 scene={scene} scenes={scenes} onClose={onClose} />
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
