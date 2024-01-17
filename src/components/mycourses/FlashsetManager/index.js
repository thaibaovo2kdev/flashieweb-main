import { useDisclosure } from '@nextui-org/react'
import { useEffect, memo, useState, useCallback } from 'react'
import {
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
} from '@nextui-org/react'

import { BsCheck2Square, BsQuestionSquare } from 'react-icons/bs'
import { TbLockCheck, TbLockCancel } from 'react-icons/tb'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import AddFlashset from '../AddFlashset'
import ChooseTypeForQuiz from '../ChooseTypeForQuiz'
const FlashsetManager = ({ children }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const columns = [
    { name: 'NO', uid: 'no' },
    { name: 'NAME', uid: 'name' },
    { name: 'QUIZ', uid: 'quiz' },
    { name: 'ACTIONS', uid: 'actions' },
  ]
  const data = [
    { id: 1, name: 'flash card 1', quiz: false, block: false },
    { id: 2, name: 'flash card 2', quiz: true, block: false },
    { id: 3, name: 'flash card 3', quiz: false, block: true },
    { id: 4, name: 'flash card 4', quiz: true, block: true },
  ]
  const renderCell = useCallback((card, columnKey) => {
    const cellValue = card[columnKey]
    switch (columnKey) {
      case 'no':
        return <p>{card.id}</p>
      case 'name':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize text-default-400'>
              {card.name}
            </p>
          </div>
        )
      case 'quiz':
        return (
          <div className='flex flex-col'>
            <BsCheck2Square size={22} />
            <ChooseTypeForQuiz>
              <BsQuestionSquare size={20} />
            </ChooseTypeForQuiz>
          </div>
        )
      case 'actions':
        return (
          <div className='relative flex items-center justify-end gap-2'>
            <TbLockCheck size={20} />
            <TbLockCancel size={20} />
            <Popover placement='bottom' showArrow={true}>
              <PopoverTrigger>
                <Button color={'primary'} className='capitalize'>
                  Edit
                </Button>
              </PopoverTrigger>
              <PopoverContent className='p-4'>
                <div className='flex min-w-[50px] flex-col items-center'>
                  <AiFillEdit className='cursor-pointer' size={22} />
                  <AiFillDelete className='mt-4 cursor-pointer' size={22} />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )
      default:
        return cellValue
    }
  }, [])
  return (
    <>
      <div className='relative' onClick={onOpen}>
        {children}
        <div className='absolute bottom-0 left-0 right-0 top-0' />
      </div>
      <Modal
        isOpen={isOpen}
        size='xl'
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-row text-center'>
                Flash set management
              </ModalHeader>
              <ModalBody>
                <div className='flex flex-row items-center justify-between'>
                  <p>COunt Name</p>
                  <AddFlashset />
                </div>
                <div className='mt-4 flex flex-row justify-around'>
                  <Button color='primary'>Unblock All</Button>
                  <Button color='primary'>Block All</Button>
                </div>
                <Table
                  aria-label=''
                  className='mt-4'
                  isHeaderSticky
                  topContentPlacement='outside'
                  bottomContentPlacement='outside'
                  classNames={{
                    wrapper: 'max-h-[512px]',
                  }}
                >
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.uid}>{column.name}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={data || []}
                    // emptyContent={course.isLoading || 'No data to display.'}
                    // isLoading={course.isLoading}
                    // loadingContent={<Spinner label='Loading...' />}
                  >
                    {(item) => (
                      <TableRow key={item?.id}>
                        {(columnKey) => (
                          <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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

export default memo(FlashsetManager, areEqual)
