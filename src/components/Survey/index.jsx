'use client'
import config from '~/utils/config'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
} from '@nextui-org/react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { alert } from '~/utils/helpers'
import { useMutation } from '@tanstack/react-query'

import * as userAPI from '~/apis/user'

export default function Survey() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const session = useSession()
  const [level, setLevel] = useState('')
  const [favorites, setFavorites] = useState([])
  const [page, setPage] = useState(1)

  const update = useMutation(
    (values) => userAPI.update(session.data.user.id, values),
    {
      onSuccess: (res) => {
        session.update({ user: res })
        alert.success('Survey has been updated successfully!')
      },
      onError: (error) => {
        console.log(error)
        alert.error(error?.response?.data?.message || 'Failed to update!')
      },
    }
  )

  const next = () => {
    setPage((p) => p + 1)
  }
  const done = () => {
    update.mutate({ attributes: { level, favorites } })
  }

  if (!session?.data || session?.data?.user?.attributes?.level) return null
  if (!session?.data?.user?.attributes) return null

  return (
    <Modal
      isOpen={true}
      isDismissable
      hideCloseButton
      onOpenChange={onOpenChange}
    >
      {page == 1 && (
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>Your level</ModalHeader>
          <ModalBody>
            <Select
              label='Select a level'
              className='max-w-xs'
              onChange={({ target }) => setLevel(target.value)}
            >
              {config.levels.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' isDisabled={!level.length} onPress={next}>
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
      {page == 2 && (
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            Your favorites
          </ModalHeader>
          <ModalBody>
            <CheckboxGroup
              label='Select favorites'
              defaultValue={favorites}
              onChange={setFavorites}
              className='h-[60vh] overflow-y-scroll'
            >
              {config.flashsetTypes.map((i) => (
                <Checkbox key={i.id} value={i.id}>
                  {i.name}
                </Checkbox>
              ))}
              {/* <Checkbox value='cartoon'>Cartoon</Checkbox>
              <Checkbox value='music'>Music</Checkbox>
              <Checkbox value='flower'>Flower</Checkbox>
              <Checkbox value='animal'>Animal</Checkbox> */}
            </CheckboxGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color='primary'
              isDisabled={!favorites.length}
              onPress={done}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  )
}
