'use client'
import { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  Spinner,
  Button,
  Pagination,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { AiFillDelete, AiOutlinePlus } from 'react-icons/ai'
import dayjs from 'dayjs'
import Link from 'next/link'
import { alert } from '~/utils/helpers'

import * as gameAPI from '~/apis/games'
import BreadCrumbs from '~/components/layouts/Breadcrumb'
import { BsSearch } from 'react-icons/bs'
import constants from '~/utils/constants'
import config from '~/utils/config'
import { BiSolidEdit } from 'react-icons/bi'
import Image from 'next/image'

const columns = [
  { name: 'No.', uid: 'index', class: 'w-5 text-center' },
  { name: 'Image', uid: 'image', class: 'text-center' },
  { name: 'Name', uid: 'name', class: 'text-center' },
  { name: 'Level', uid: 'level', class: 'w-28 text-center' },
  { name: 'Type', uid: 'type', class: 'w-28 text-center' },
  { name: 'Status', uid: 'status', class: 'w-16 text-center' },
  { name: 'Edit', uid: 'actions', class: 'w-10 text-center' },
]
const types = [
  { key: 'matching1', name: 'Match Flash' },
  { key: 'matching2', name: 'Flip Flop' },
]

const GameDetail = () => {
  const queryClient = useQueryClient()
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pages = Math.ceil(total / perPage) || 1
  const [filterValue, setFilterValue] = useState('')
  const [type, setType] = useState('')
  const [level, setLevel] = useState('')

  const course = useQuery({
    queryKey: ['game-management', page, perPage, filterValue, type, level],
    keepPreviousData: false,
    queryFn: () =>
      gameAPI.me({ page, perPage, q: filterValue, type, level }).then((res) => {
        setTotal(res.total)
        return res.data.map((i, index) => ({
          ...i,
          index: index + 1 + (page * perPage - perPage),
        }))
      }),
  })

  const handleDel = (id) => () => {
    alert.deleteComfirm({
      onDelete: () =>
        gameAPI
          .del(id)
          .then(() => queryClient.refetchQueries(['game-management'])),
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
      case 'createdAt':
        return (
          <div className='flex flex-col'>
            {/* <p className='text-bold text-sm capitalize'>{cellValue}</p> */}
            <p className='text-bold text-sm capitalize text-default-400'>
              {dayjs(cell.createdAt).format(constants.format_date)}
            </p>
          </div>
        )
      case 'level':
        return (
          <div className='text-bold flex w-28 flex-col text-center text-sm capitalize'>
            {cell.level}
          </div>
        )
      case 'type':
        return (
          <div className='text-bold flex w-28 flex-col text-center text-sm capitalize'>
            {types.find((i) => i.key === cell.type)?.name || ''}
          </div>
        )
      case 'status':
        return (
          <div className='text-bold flex w-16 flex-col text-center text-sm capitalize'>
            {cell.status}
          </div>
        )
      case 'actions':
        return (
          <div className='relative flex w-10 items-center gap-2'>
            <Tooltip content='Edit'>
              <Link href={`/teacher/game-management/edit?id=${cell.id}`}>
                <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                  <BiSolidEdit />
                </span>
              </Link>
            </Tooltip>
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

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])
  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-3'>
          <div className='flex w-full flex-1 flex-row gap-2'>
            <Input
              isClearable
              className='w-full sm:max-w-[44%]'
              placeholder='Search by name...'
              startContent={<BsSearch />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <Select
              size='sm'
              label={'Type'}
              name={'Type'}
              value={type}
              selectionMode='single'
              className='w-32'
              classNames={{ mainWrapper: 'h-10 w-32' }}
              onChange={({ target }) => setType(target.value)}
            >
              {types.map((i) => (
                <SelectItem key={i.key}>{i.name}</SelectItem>
              ))}
            </Select>
            <Select
              size='sm'
              label={'Level'}
              name={'Level'}
              value={level}
              selectionMode='single'
              className='w-28'
              classNames={{ mainWrapper: 'h-10 w-28' }}
              onChange={({ target }) => setLevel(target.value)}
            >
              {config.levels.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className='flex gap-3'>
            {/* <FlashsetSearch> */}
            <Link href='/teacher/game-management/edit'>
              <Button color='primary' startContent={<AiOutlinePlus />}>
                Add New Game
              </Button>
            </Link>
            {/* </FlashsetSearch> */}
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
  }, [total, filterValue, perPage, onRowsPerPageChange])

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
              align={['type'].includes(column.uid) ? 'center' : 'start'}
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

export default GameDetail
