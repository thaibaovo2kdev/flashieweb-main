'use client'
import { useEffect, memo, useState, useCallback, useMemo } from 'react'
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
  Pagination,
} from '@nextui-org/react'
import { Formik } from 'formik'

import * as flashsetAPI from '~/apis/flashsets'
import * as courseAPI from '~/apis/courses'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { alert } from '~/utils/helpers'
import config from '~/utils/config'

const FlashsetSearch = ({ children, isOpen }) => {
  const [_isOpen, setIsOpen] = useState(isOpen || false)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pages = Math.ceil(total / perPage) || 1

  const [state, setState] = useState({
    name: '',
    type: 'all',
  })
  const [selected, setSelected] = useState([])
  const { id } = useParams()
  const queryClient = useQueryClient()

  const flashset = useQuery({
    queryKey: ['search-flashsets', page, perPage, state.name, state.type],
    queryFn: () =>
      flashsetAPI
        .getMyFlashsets({
          page: page,
          perPage: perPage,
          q: state.name,
          type: state.type,
        })
        .then((res) => {
          setTotal(res.total)
          return res.data
        }),
  })
  const create = useMutation((values) => courseAPI.addFlashsets(id, values), {
    // onMutate: async (values) => {
    //   disabled.current = true
    //   if (values.image?.includes?.('blob:')) {
    //     values.image = await fileAPI
    //       .uploads([values.image])
    //       .then((r) => r[0].url)
    //   }
    //   return values
    // },
    onSuccess: (res) => {
      alert.success('Flash card has been added successfully!')
      queryClient.refetchQueries(['course-flashsets'])
      setIsOpen(false)
    },
    onError: (error) => {
      console.log(error)
      alert.error('Failed to add!')
    },
  })

  const handleSearch = (values) => {
    setState(values)
  }
  const handleSubmit = () => {
    create.mutate(selected)
  }

  const renderCell = useCallback((cell, columnKey) => {
    const cellValue = cell[columnKey]
    console.log(columnKey, 'columnKey')
    switch (columnKey) {
      // case 'name1':
      //   return (
      //     <User
      //       avatarProps={{ size: 'sm', radius: 'lg', src: cell.image }}
      //       // description={cell.image}
      //       name={cell.name}
      //     >
      //       {cell.name}
      //     </User>
      //   )
      default:
        return cellValue
    }
  }, [])

  const onRowsPerPageChange = useCallback((e) => {
    setPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onNextPage = useCallback(() => {
    if (page < pages) setPage(page + 1)
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) setPage(page - 1)
  }, [page])

  const bottomContent = useMemo(() => {
    return (
      <div className='flex items-center justify-between px-2 py-2'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className='hidden w-[30%] justify-end gap-2 sm:flex'>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }, [page, pages])

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
        isOpen={_isOpen}
        size='xl'
        isDismissable={false}
        onOpenChange={() => {
          setIsOpen(false)
        }}
      >
        <ModalContent>
          <ModalHeader className='flex flex-row text-center'>
            List Flash Set
          </ModalHeader>
          <ModalBody>
            <Formik
              onSubmit={handleSearch}
              initialValues={state}
              enableReinitialize={true}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <div className='flex w-full flex-col'>
                  <div className='flex flex-row gap-2'>
                    <Input
                      type='text'
                      label='Search Group'
                      placeholder='Search Flash set name'
                      // className='my-2 min-w-[320px]'
                      name='name'
                      errorMessage={errors.name}
                      value={values.name}
                      onChange={handleChange}
                    />
                    <Select
                      label='Type'
                      name='type'
                      className='w-56'
                      defaultSelectedKeys={
                        values.type ? [values.type] : undefined
                      }
                      onChange={handleChange}
                    >
                      <SelectItem key={'all'} value={'all'}>
                        All
                      </SelectItem>
                      {config.flashsetTypes.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <Button
                      type='submit'
                      color='primary'
                      onPress={handleSubmit}
                    >
                      Filter
                    </Button>
                  </div>

                  {/* <div className='flex w-[100%] flex-col'>
                    <Select
                      label='Type'
                      name='type'
                      defaultSelectedKeys={
                        values.type ? [values.type] : undefined
                      }
                      className='my-2'
                      onChange={handleChange}
                    >
                      <SelectItem key={'flower'} value={'flower'}>
                        Flower
                      </SelectItem>
                      <SelectItem key={'animal'} value={'animal'}>
                        Animal
                      </SelectItem>
                    </Select>
                    <div className='flex flex-row justify-end'>
                      <Button
                        type='submit'
                        color='primary'
                        className='mr-0 mt-6 w-max'
                        onClick={handleSubmit}
                      >
                        Filter
                      </Button>
                    </div>
                  </div> */}
                </div>
              )}
            </Formik>

            <Table
              removeWrapper
              bottomContent={bottomContent}
              bottomContentPlacement='outside'
              // color={selectedColor}
              selectionMode='multiple'
              defaultSelectedKeys={selected}
              aria-label='Example static collection table'
              onSelectionChange={(s) =>
                s !== 'all'
                  ? setSelected([...s])
                  : setSelected(flashset.data?.map((i) => i.id))
              }
            >
              <TableHeader columns={[{ name: 'Name', uid: 'name' }]}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    className='w-full'
                    align={'start'}
                  >
                    {column.name}
                  </TableColumn>
                )}
                {/* <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn> */}
              </TableHeader>
              <TableBody
                items={flashset.data || []}
                emptyContent={flashset.isLoading || 'No data to display.'}
                isLoading={flashset.isLoading}
                loadingContent={<Spinner label='Loading...' />}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* <p className='mt-4 text-center text-large text-lg'>Name</p>
            <div className='flex flex-col'>
              {[1, 2, 3, 4, 5, 6].map((i, idx) => (
                <Checkbox
                  name={i}
                  key={idx}
                  defaultSelected
                  size='md'
                  onChange={handleChange}
                >
                  Name {i}
                </Checkbox>
              ))}
            </div> */}
          </ModalBody>

          <ModalFooter>
            <Button
              color='primary'
              isDisabled={selected.length === 0}
              isLoading={create.isLoading}
              onPress={handleSubmit}
            >
              Submit
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

export default memo(FlashsetSearch, areEqual)
