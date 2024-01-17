'use client'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
  Spinner,
  Button,
  Pagination,
} from '@nextui-org/react'
import {
  AiFillCheckSquare,
  AiFillDelete,
  AiFillEdit,
  AiOutlinePlus,
} from 'react-icons/ai'
import dayjs from 'dayjs'
import Link from 'next/link'
import { alert } from '~/utils/helpers'
import { useParams, useSearchParams } from 'next/navigation'
import CreateQuiz from './CreateQuiz'
import FlashsetSearch from '~/components/FlashsetSearch'
import BreadCrumbs from '~/components/layouts/Breadcrumb'

// import * as userAPI from '~/apis/user'MdAssignmentAdd
import * as courseAPI from '~/apis/courses'
import { BsQuestionSquare, BsFillCheckSquareFill } from 'react-icons/bs'
import { MdAssignmentAdd } from 'react-icons/md'
import Image from 'next/image'

const columns = [
  { name: 'No.', uid: 'index', class: 'w-5 text-center' },
  { name: 'Image', uid: 'image', class: 'text-center' },
  { name: 'Name', uid: 'name', class: 'text-center' },
  { name: 'Quiz', uid: 'hasQuiz', class: 'w-20 text-center' },
  // { name: 'Point', uid: 'point' },
  // { name: 'STATUS', uid: 'status' },
  { name: 'Actions', uid: 'actions', class: 'w-28 text-center' },
]

const CourseDetail = () => {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const queryClient = useQueryClient()
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pages = Math.ceil(total / perPage) || 1

  const course = useQuery({
    queryKey: ['course-flashsets', id, page, perPage],
    keepPreviousData: false,
    queryFn: () =>
      courseAPI.getFlashsets(id, { page, perPage }).then((res) => {
        setTotal(res.total)
        return res.data.map((i, index) => ({
          ...i,
          index: index + 1 + (page * perPage - perPage),
        }))
      }),
  })

  const handleDel = (flashsetId) => () => {
    alert.deleteComfirm({
      onDelete: () =>
        courseAPI
          .delCourseFlashsets(id, flashsetId)
          .then(() => queryClient.refetchQueries(['course-flashsets', id])),
    })
  }

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

  const renderCell = useCallback((cell, columnKey) => {
    const cellValue = cell[columnKey]
    switch (columnKey) {
      case 'name':
        return <div className='text-center'>{cell.name}</div>
      case 'image':
        return (
          <div className='flex flex-col items-center justify-center'>
            <Image
              src={cell.image}
              width={80}
              height={80}
              alt={cell.name}
              className='h-10 w-10 rounded-md'
            />
          </div>
        )
      case 'index':
        return (
          <div className='text-bold w-5 text-center text-sm capitalize text-default-400'>
            {cell.index}
          </div>
        )
      case 'hasQuiz':
        if (cell.totalCards === 0) {
          return (
            <div className='w-20 text-center'>
              <MdAssignmentAdd
                size={24}
                onClick={() => alert.confirm("Don't have a card yet!")}
              />
            </div>
          )
        }
        return (
          <CreateQuiz courseId={id} flashsetId={cell.id}>
            {cell.hasQuiz ? (
              <div className='flex w-20 flex-col items-center'>
                <BsFillCheckSquareFill size={24} className='cursor-pointer' />
              </div>
            ) : (
              <div className='flex w-20 flex-col items-center'>
                <MdAssignmentAdd size={24} className='cursor-pointer' />
              </div>
            )}
          </CreateQuiz>
        )
      case 'createdAt':
        return (
          <div className='flex flex-col'>
            {/* <p className='text-bold text-sm capitalize'>{cellValue}</p> */}
            <p className='text-bold text-sm capitalize text-default-400'>
              {dayjs(cell.createdAt).format('DD/MM/YYYY')}
            </p>
          </div>
        )
      case 'point':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>{cell.point}</p>
          </div>
        )
      // case 'status':
      //   return (
      //     <Chip
      //       className='capitalize'
      //       color={statusColorMap[course.status]}
      //       size='sm'
      //       variant='flat'
      //     >
      //       {cellValue}
      //     </Chip>
      //   )
      case 'actions':
        return (
          <div className='relative flex items-center justify-center gap-2'>
            {/* <Tooltip content='Edit user'>
              <Link href={`/my-room/courses/${id}/students/${cell.id}`}>
                <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                  <AiFillEdit />
                </span>
              </Link>
            </Tooltip> */}
            <Tooltip color='danger' content='Delete'>
              <span
                className='cursor-pointer text-lg text-default-400 active:opacity-50'
                onClick={handleDel(cell.id)}
              >
                <AiFillDelete />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-3'>
          <div className='w-full sm:max-w-[44%]' />

          <div className='flex gap-3'>
            <FlashsetSearch isOpen={action === 'newflashset'}>
              <Button color='primary' startContent={<AiOutlinePlus />}>
                Add Flash set
              </Button>
            </FlashsetSearch>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-small text-default-400'>Total {total}</span>
          <label className='flex items-center text-small text-default-400'>
            Rows per page:
            <select
              value={`${perPage}`}
              className='bg-transparent text-small text-default-400 outline-none'
              onChange={onRowsPerPageChange}
            >
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [total, perPage, onRowsPerPageChange])

  const bottomContent = useMemo(() => {
    return (
      <div className='flex items-center justify-between px-2 py-2'>
        <div className='w-[30%]' />
        {/* <span className='w-[30%] text-small text-default-400'>
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span> */}
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
    <div className='flex w-full flex-col'>
      <BreadCrumbs />
      <Table
        aria-label='Example table with custom cells'
        topContent={topContent}
        topContentPlacement='outside'
        bottomContent={bottomContent}
        bottomContentPlacement='outside'
        classNames={{
          wrapper: 'bg-blue-100 p-0 rounded-md border-2 border-[#5E9DD0]',
          // table: 'border-collapse border-hidden',
          thead: '[&>tr]:first:shadow-none',
          // td: ' border-2',
          th: [
            'bg-transparent',
            'font-semibold',
            'text-slate-700',
            'border-b-2',
            'border-divider',
            'border-[#5E9DD0] ',
          ],
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              className={column.class}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={course.data || []}
          emptyContent={course.isLoading || 'No data to display.'}
          isLoading={course.isLoading}
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
    </div>
  )
}

export default CourseDetail
