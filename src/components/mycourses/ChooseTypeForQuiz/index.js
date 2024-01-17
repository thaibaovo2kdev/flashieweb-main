import { Checkbox, useDisclosure } from '@nextui-org/react'
import { useEffect, memo, useState, useCallback } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from '@nextui-org/react'

import { BsCheck2Square, BsQuestionSquare } from 'react-icons/bs'
import { TbLockCheck, TbLockCancel } from 'react-icons/tb'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import AddFlashset from '../AddFlashset'
import constants from '~/utils/constants'

const ChooseTypeForQuiz = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleChange = ({ target }) => {
    console.log('target', target.name, target.checked)
  }
  return (
    <>
      <div
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {children}
      </div>
      <Modal
        isOpen={isOpen}
        size='xl'
        onOpenChange={() => {
          setIsOpen(false)
        }}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-row text-center'>
                {constants.quiz_let_choose}
              </ModalHeader>
              <ModalBody>
                <p className='mt-4 text-center text-large text-lg'>Type</p>
                <Checkbox
                  className='mt-4'
                  name={'ABCD'}
                  defaultSelected
                  size='md'
                  onChange={handleChange}
                >
                  {constants.quiz_abcd}
                </Checkbox>
                <Checkbox
                  className='mt-4'
                  name={' ArrangWord'}
                  defaultSelected
                  size='md'
                  onChange={handleChange}
                >
                  {constants.quiz_arrange_word}
                </Checkbox>
                <Checkbox
                  className='mt-4'
                  name={' ArrangWord'}
                  defaultSelected
                  size='md'
                  onChange={handleChange}
                >
                  {constants.quiz_blank}
                </Checkbox>
                <div className='mt-4 flex flex-row justify-around'>
                  <Button color='primary'>Yes</Button>
                  <Button color='primary'>No</Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

function areEqual(p, n) {
  return true
}

export default memo(ChooseTypeForQuiz, areEqual)
