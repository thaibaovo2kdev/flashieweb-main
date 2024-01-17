'use client'
import { useRef, memo, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  CheckboxGroup,
  Checkbox,
} from '@nextui-org/react'

import * as courseAPI from '~/apis/courses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { alert } from '~/utils/helpers'
import constants from '~/utils/constants'

const CreateQuiz = ({ children, courseId, flashsetId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [types, setTypes] = useState([])
  const queryClient = useQueryClient()
  const disabled = useRef(false)

  const createQuiz = useMutation(
    (values) => courseAPI.createQuiz(courseId, flashsetId, values),
    {
      onMutate: async (values) => {
        disabled.current = true
        // if (values.image?.includes?.('blob:')) {
        //   values.image = await fileAPI
        //     .uploads([values.image])
        //     .then((r) => r[0].url)
        // }
        return values
      },
      onSuccess: (res) => {
        alert.success('Quiz has been created successfully!')
        setIsOpen(false)
        queryClient.refetchQueries(['course-flashsets'])
        disabled.current = false
      },
      onError: (error) => {
        disabled.current = false
        console.log(error)
        alert.error('Failed to create!')
      },
    }
  )
  const handleCreateQuiz = () => {
    if (disabled.current) return
    createQuiz.mutate(types)
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
      {isOpen && (
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
                  <CheckboxGroup
                    label='Types'
                    defaultValue={types}
                    onChange={setTypes}
                  >
                    <Checkbox value='abcd'>{constants.quiz_abcd}</Checkbox>
                    <Checkbox value='arrange-word'>{constants.quiz_arrange_word}</Checkbox>
                    <Checkbox value='blank'>{constants.quiz_blank}</Checkbox>
                  </CheckboxGroup>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onPress={handleCreateQuiz}
                    isDisabled={types.length === 0}
                    isLoading={createQuiz.isLoading}
                    color='primary'
                  >
                    Create Quiz
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

function areEqual(p, n) {
  return true
}

export default memo(CreateQuiz)
