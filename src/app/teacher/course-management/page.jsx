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
  Input,
  Chip,
  Tooltip,
  Button,
  Spinner,
  Pagination,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { AiFillSetting, AiOutlinePlus } from 'react-icons/ai'
import {
  BiSolidCopy,
  BiSolidLayerPlus,
  BiSolidUserPlus,
  BiTrash,
  BiSolidEdit,
} from 'react-icons/bi'
import BreadCrumbs from '~/components/layouts/Breadcrumb'

import dayjs from 'dayjs'
import Link from 'next/link'
import { alert, copyToClipboard, useWindowSize } from '~/utils/helpers'
import * as courseAPI from '~/apis/courses'
import { BsSearch } from 'react-icons/bs'
import constants from '~/utils/constants'
import config from '~/utils/config'

const statusColorMap = {
  active: 'success',
  deleted: 'danger',
  inactive: 'warning',
}

const columns = [
  { name: constants.column_course_no, uid: 'index', class: 'w-5 text-center' },
  { name: constants.column_course_name, uid: 'name', class: 'text-center' },
  {
    name: constants.column_course_attendance,
    uid: 'totalStudents',
    class: 'w-14 text-center',
  },
  {
    name: constants.column_course_createdate,
    uid: 'createdAt',
    class: 'w-24 text-center',
  },
  // { name: 'ACCESS', uid: 'type' },
  {
    name: constants.column_course_status,
    uid: 'status',
    class: 'w-14 text-center',
  },
  {
    name: constants.column_course_action,
    uid: 'actions',
    class: 'text-center w-36',
  },
]

const Courses = () => {
  const queryClient = useQueryClient()
  const { isMobile, isTablet } = useWindowSize()
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'age',
    direction: 'ascending',
  })
  const [filterValue, setFilterValue] = useState('')
  const [level, setLevel] = useState('')
  const [total, setTotal] = useState(0)

  const course = useQuery({
    queryKey: ['course-management', page, perPage, filterValue, level],
    queryFn: () =>
      courseAPI
        .myCourses({ page, perPage, q: filterValue, level })
        .then((res) => {
          setTotal(res.total)
          return res.data.map((i, index) => ({
            ...i,
            index: index + 1 + (page * perPage - perPage),
          }))
        }),
  })
  console.log(total, 'totaltotaltotal')
  const pages = Math.ceil(total / perPage) || 1

  const handleDel = (id) => () => {
    alert.deleteComfirm({
      onDelete: () =>
        courseAPI
          .del(id)
          .then(() => queryClient.refetchQueries(['course-management'])),
    })
  }

  const generateToken = async (courseId) => {
    try {
      const res = await courseAPI.createToken(courseId)
      copyToClipboard(res.token)
    } catch (error) {
      alert.error(error?.response?.data?.message || 'Failed to create!')
    }
  }

  const renderCell = useCallback((course, columnKey) => {
    const cellValue = course[columnKey]

    switch (columnKey) {
      case 'name':
        return <p className='text-center'>{course.name}</p>
      case 'index':
        return (
          <div className='text-bold w-5 text-center text-sm capitalize text-default-400'>
            {course.index}
          </div>
        )
      case 'totalStudents':
        return (
          <div className='text-bold w-14 text-center text-sm capitalize text-default-400'>
            {course.totalStudentAccepteds}/{course.totalStudents}
          </div>
        )
      case 'createdAt':
        return (
          <div className='text-bold w-24 text-center text-sm capitalize text-default-400'>
            {dayjs(course.createdAt).format(constants.format_date)}
          </div>
        )
      case 'type':
        return (
          <div className='text-bold w-10 text-sm capitalize'>
            {courseTypes.find((t) => t.key == course.type)?.name || ''}
          </div>
        )
      case 'status':
        return (
          <Chip
            className='w-14 capitalize'
            color={statusColorMap[course.status]}
            size='sm'
            variant='flat'
          >
            {cellValue}
          </Chip>
        )
      case 'actions':
        return (
          <div className='relative flex w-36 items-center justify-center gap-2'>
            <Tooltip content={constants.course_copy_token}>
              <span
                onClick={() => generateToken(course.id)}
                className='hidden cursor-pointer text-lg text-default-400 active:opacity-50 md:block'
              >
                <BiSolidCopy />
              </span>
            </Tooltip>
            <Tooltip content={constants.label_edit}>
              <Link href={`/teacher/course-management/edit?id=${course.id}`}>
                <span className='hidden cursor-pointer text-lg text-default-400 active:opacity-50 md:block'>
                  <BiSolidEdit />
                </span>
              </Link>
            </Tooltip>
            <Tooltip content='Add a New Student'>
              <Link href={`/teacher/course-management/${course.id}/students`}>
                <span className='hidden cursor-pointer text-lg text-default-400 active:opacity-50 md:block'>
                  <BiSolidUserPlus />
                </span>
              </Link>
            </Tooltip>
            <Tooltip content={constants.label_flashset_management}>
              <Link href={`/teacher/course-management/${course.id}/flashsets`}>
                <span className='hidden cursor-pointer text-lg text-default-400 active:opacity-50 md:block'>
                  <BiSolidLayerPlus />
                </span>
              </Link>
            </Tooltip>
            <Tooltip color='danger' content='Delete'>
              <span
                className='hidden cursor-pointer text-lg text-default-400 active:opacity-50 md:block'
                onClick={handleDel(course.id)}
              >
                <BiTrash />
              </span>
            </Tooltip>

            <Popover placement='bottom' showArrow={true}>
              <PopoverTrigger>
                <Button
                  isIconOnly
                  variant='light'
                  size='md'
                  className='h-6 w-6 md:hidden'
                >
                  <AiFillSetting />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='flex flex-col gap-1 py-2'>
                  <Button
                    size='sm'
                    variant='light'
                    className='w-full justify-start'
                    onPress={() => copyToClipboard(course.id)}
                  >
                    <BiSolidCopy /> {constants.course_copy_token}
                  </Button>
                  <Link
                    href={`/teacher/course-management/edit?id=${course.id}`}
                  >
                    <Button
                      size='sm'
                      variant='light'
                      className='w-full justify-start'
                    >
                      <BiSolidEdit /> {constants.label_edit}
                    </Button>
                  </Link>
                  <Link
                    href={`/teacher/course-management/${course.id}/students`}
                  >
                    <Button
                      size='sm'
                      variant='light'
                      className='w-full justify-start'
                    >
                      <BiSolidUserPlus /> {constants.label_add_student}
                    </Button>
                  </Link>
                  <Link
                    href={`/teacher/course-management/${course.id}/flashsets`}
                  >
                    <Button
                      size='sm'
                      variant='light'
                      className='w-full justify-start'
                    >
                      <BiSolidLayerPlus /> {constants.label_add_flashset}
                    </Button>
                  </Link>
                  <Button
                    size='sm'
                    variant='light'
                    className='w-full justify-start'
                    onPress={handleDel(course.id)}
                  >
                    <BiTrash /> {constants.label_delete}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
            {/* <Select
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
            </Select> */}
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
            <Link href='/teacher/course-management/edit'>
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
              <span className='text-center'></span>
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
