'use client'
import { useEffect, memo, useState, useCallback } from 'react'
import {
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox,
  User,
} from '@nextui-org/react'
import { Formik } from 'formik'

import * as flashsetAPI from '~/apis/flashsets'
import * as courseAPI from '~/apis/courses'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { alert } from '~/utils/helpers'
import config from '~/utils/config'
import constants from '~/utils/constants'

const AddCourseToken = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState('')
  const [selected, setSelected] = useState([])

  const joinToken = useMutation((values) => courseAPI.joinToken(values), {
    // onMutate: async (values) => {
    //   if (avt) {
    //     values.avatar = await courseAPI.upload(avt);
    //   }
    //   return values;
    // },
    onSuccess: (res) => {
      alert.success('Your request has been sent successfully!')
    },
    onError: (error) => {
      console.log(error)
      alert.error(error?.response?.data?.message || 'Failed to update!')
    },
  })

  const handleSubmit = () => {
    joinToken.mutate(token)
  }
  const handleChange = ({ target }) => {
    setToken(target.value)
  }

  return (
    <>
      <div
        className='relative'
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {children}
        <div className='absolute bottom-0 left-0 right-0 top-0 cursor-pointer' />
      </div>
      <Modal
        isOpen={isOpen}
        size='xl'
        isDismissable={false}
        onOpenChange={() => {
          setIsOpen(false)
        }}
      >
        <ModalContent>
          <ModalHeader className='flex flex-row text-center'>
            {constants.course_input_access_code}
          </ModalHeader>
          <ModalBody>
            <Input
              type='text'
              label={constants.course_token}
              placeholder={constants.course_enter_access_code}
              // className='my-2 min-w-[320px]'
              name={'token'}
              // errorMessage={errors.name}
              value={token}
              onChange={handleChange}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              color='primary'
              isDisabled={token.length < 5}
              isLoading={joinToken.isLoading}
              onPress={handleSubmit}
            >
              {constants.label_join_course}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function areEqual(p, n) {
  return true
}

export default memo(AddCourseToken, areEqual)
