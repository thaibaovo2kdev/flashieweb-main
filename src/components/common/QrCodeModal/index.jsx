'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react'
import QRCode from 'qrcode.react'

export default function QrCodeModal({ children, value }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>QRCode</ModalHeader>
              <ModalBody>
                <QRCode value={value} />
              </ModalBody>
              <ModalFooter>
                {/* <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={() => setImage('sdas')}>
                  Action
                </Button>
                 */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
