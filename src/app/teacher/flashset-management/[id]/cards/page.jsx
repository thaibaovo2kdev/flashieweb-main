'use client'
import { useMemo, memo, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
  Spinner,
  Button,
} from '@nextui-org/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AiFillDelete, AiFillEdit, AiOutlinePlus } from 'react-icons/ai'
import { alert } from '~/utils/helpers'
import constants from '~/utils/constants'
import { useParams, useSearchParams } from 'next/navigation'
import BreadCrumbs from '~/components/layouts/Breadcrumb'
import ImportCards from '~/components/ImportCards'

import * as flashcardsAPI from '~/apis/flashcards'
import * as flashsetsAPI from '~/apis/flashsets'
import { FaFileDownload, FaFileUpload } from 'react-icons/fa'

const columns = [
  { name: constants.label_no, uid: 'no', class: 'w-5 text-center' },
  { name: constants.fronttext, uid: 'frontText', class: 'w-5 text-center' },
  { name: constants.frontimage, uid: 'frontImage', class: 'w-5 text-center' },
  { name: constants.backtext, uid: 'backText', class: 'w-5 text-center' },
  { name: constants.label_action, uid: 'action', class: 'w-5 text-center' },
]

const Card = (props) => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')

  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const flashcard = useQuery({
    queryKey: ['flashcards', id, page, perPage],
    queryFn: () =>
      flashsetsAPI.getFlashcards({ id, page, perPage }).then((res) => {
        setTotal(res.total)
        return res.data.map((i, index) => ({
          ...i,
          index: index + 1 + (page * perPage - perPage),
        }))
      }),
  })
  const flashset = useQuery({
    queryKey: ['flashset', id],
    queryFn: () => flashsetsAPI.getFlashsetById(id),
  })

  const handleDel = (id) => () => {
    alert.deleteComfirm({
      onDelete: () =>
        flashcardsAPI
          .del(id)
          .then(() => queryClient.refetchQueries(['flashcards'])),
    })
  }

  const renderCell = useCallback((flashcard, columnKey, idx) => {
    const cellValue = flashcard[columnKey]
    switch (columnKey) {
      case 'no':
        return (
          <div className='text-bold flex flex-col text-center text-sm text-default-400'>
            {flashcard.index}
          </div>
        )
      case 'frontText':
        return (
          <div className='text-bold flex flex-col text-center text-sm text-default-400'>
            {flashcard.frontText}
          </div>
        )
      case 'frontImage':
        return (
          <div className='flex flex-col items-center justify-center'>
            <div className='flex h-16 w-16 flex-col items-center justify-center border bg-blue-200'>
              {flashcard.frontImage?.length > 0 ? (
                <img className='h-16 w-16' src={flashcard.frontImage} />
              ) : (
                <span className='text-xs'>No Image</span>
              )}
            </div>
          </div>
        )
      case 'backText':
        return (
          <div className='text-bold flex flex-col text-center text-sm text-default-400'>
            {flashcard.backText}
          </div>
        )
      case 'action':
        return (
          <div className='relative flex items-center justify-center gap-2'>
            {/* <Tooltip content='Details'>
              <Link href={`/flashsets/${id}/cards/editor/${flashcard.id}`}>
                <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                  <AiFillEye />
                </span>
              </Link>
            </Tooltip> */}
            <Tooltip content='Edit Card'>
              <Link
                href={`/teacher/flashset-management/${id}/cards/edit?cardId=${flashcard.id}`}
              >
                <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                  <AiFillEdit />
                </span>
              </Link>
            </Tooltip>
            <Tooltip color='danger' content='Delete'>
              <span
                className='cursor-pointer text-lg text-default-400 active:opacity-50'
                onClick={handleDel(flashcard.id)}
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

  const pages = Math.ceil(total / perPage) || 1

  const onRowsPerPageChange = useCallback((e) => {
    setPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-3'>
          <div className='flex w-full flex-row justify-start gap-1 sm:max-w-[44%]'>
            <ImportCards
              flashsetId={id}
              isOpen={true}
              onDone={() => queryClient.refetchQueries(['flashcards'])}
            />
            <a href='/template_insert_flashset.xlsx' download>
              <div className='flex flex-row items-center justify-center gap-1 rounded-md border bg-slate-300 px-2 py-1'>
                <FaFileDownload />
                Template file
              </div>
            </a>
          </div>
          <div className='flex gap-3'>
            <Link href={`/teacher/flashset-management/${id}/cards/edit`}>
              <Button color='primary' startContent={<AiOutlinePlus />}>
                Add Card
              </Button>
            </Link>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-small text-default-400'>
            {flashset?.data?.name}: Total {total}
          </span>
          <label className='flex items-center text-small text-default-400'>
            Rows per page:
            <select
              className='bg-transparent text-small text-default-400 outline-none'
              onChange={onRowsPerPageChange}
              value={`${perPage}`}
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [total, flashset, onRowsPerPageChange])

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
    <div className='w-full'>
      <BreadCrumbs />
      <Table
        aria-label=''
        className='mt-4'
        isHeaderSticky
        topContent={topContent}
        topContentPlacement='outside'
        bottomContent={bottomContent}
        bottomContentPlacement='outside'
        classNames={{
          wrapper: 'bg-blue-100 p-0 rounded-md border-2 border-[#5E9DD0]',
          thead: '[&>tr]:first:shadow-none',
          th: [
            'bg-transparent',
            'font-semibold',
            'text-slate-700',
            'border-b-2',
            'border-divider',
            'border-[#5E9DD0] ',
          ],
          tr: 'border-b border-[#5E9DD0]',
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
          items={flashcard.data || []}
          emptyContent={flashcard.isLoading || 'No data to display.'}
          isLoading={flashcard.isLoading}
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

function areEqual(p, n) {
  return true
}

export default memo(Card, areEqual)
