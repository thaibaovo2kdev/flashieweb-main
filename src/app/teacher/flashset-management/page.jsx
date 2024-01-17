'use client'
import { useCallback, useState, useRef, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Spinner,
  Pagination,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'
import { BiSolidLayerPlus, BiTrash, BiSolidEdit } from 'react-icons/bi'
import BreadCrumbs from '~/components/layouts/Breadcrumb'
import Link from 'next/link'
import { alert, useWindowSize } from '~/utils/helpers'
import * as flashsetAPI from '~/apis/flashsets'
import { BsSearch } from 'react-icons/bs'
import constants from '~/utils/constants'
import config from '~/utils/config'

const columns = [
  { name: constants.label_no, uid: 'index', class: 'w-5 text-center' },
  { name: 'Name', uid: 'name', class: 'text-center' },
  {
    name: constants.label_flashset_type,
    uid: 'type',
    class: 'w-24 text-center',
  },
  // { name: 'Create', uid: 'createdAt' },
  // { name: 'ACCESS', uid: 'type' },
  { name: 'Status', uid: 'status', class: 'w-24 text-center' },
  { name: constants.label_edit, uid: 'actions', class: 'w-24 text-center' },
]

const Courses = () => {
  const queryClient = useQueryClient()
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const [total, setTotal] = useState(0)
  const [filterValue, setFilterValue] = useState('')
  const [type, setType] = useState('')

  const course = useQuery({
    queryKey: ['flashset-management', page, perPage, filterValue, type],
    queryFn: () =>
      flashsetAPI
        .getMyFlashsets({ page, perPage, q: filterValue, type })
        .then((res) => {
          setTotal(res.total)
          return res.data.map((i, index) => ({
            ...i,
            index: index + 1 + (page * perPage - perPage),
          }))
        }),
  })

  const pages = Math.ceil(total / perPage) || 1

  const handleDel = (id) => () => {
    alert.deleteComfirm({
      onDelete: () =>
        flashsetAPI
          .del(id)
          .then(() => queryClient.refetchQueries(['flashset-management'])),
    })
  }

  const renderCell = useCallback((cell, columnKey) => {
    const cellValue = cell[columnKey]

    switch (columnKey) {
      case 'name':
        return <p className='text-center'>{cell.name}</p>
      case 'index':
        return (
          <div className='text-bold text-center text-sm capitalize text-default-400'>
            {cell.index}
          </div>
        )
      case 'type':
        return (
          <div className='text-bold w-24 text-center text-sm capitalize text-default-400'>
            {cell.type}
          </div>
        )
      case 'status':
        return (
          <div className='text-bold w-24 text-center text-sm capitalize text-default-400'>
            {cell.status}
          </div>
        )

      case 'actions':
        return (
          <div className='relative flex w-24 items-center justify-center gap-2'>
            <Tooltip content='Edit'>
              <Link href={`/teacher/flashset-management/edit?id=${cell.id}`}>
                <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                  <BiSolidEdit />
                </span>
              </Link>
            </Tooltip>

            <Tooltip content='Add flash card'>
              <Link href={`/teacher/flashset-management/${cell.id}/cards`}>
                <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                  <BiSolidLayerPlus />
                </span>
              </Link>
            </Tooltip>
            <Tooltip color='danger' content='Delete'>
              <span
                className='cursor-pointer text-lg text-default-400 active:opacity-50'
                onClick={handleDel(cell.id)}
              >
                <BiTrash />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

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
          <div className='flex flex-1 flex-row items-center gap-2'>
            <Input
              isClearable
              className='w-64'
              placeholder='Search by name...'
              startContent={<BsSearch />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <Select
              size='sm'
              label={constants.label_flashset_type}
              name={'type'}
              value={type}
              selectionMode='single'
              // selectedKeys={type?.length > 0 ? [''] : undefined}
              className='w-36'
              classNames={{ mainWrapper: 'h-10 w-36' }}
              onChange={({ target }) => setType(target.value)}
            >
              {config.flashsetTypes.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className='flex gap-3'>
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <Link href='/teacher/flashset-management/edit'>
              <Button color='primary' startContent={<AiOutlinePlus />}>
                Add New
              </Button>
            </Link>
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
  }, [total, perPage, filterValue, onRowsPerPageChange])

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
    <div className='w-ful'>
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
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              className={column.class}
              align={column.uid === 'actions' ? 'end' : 'start'}
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

export default Courses
