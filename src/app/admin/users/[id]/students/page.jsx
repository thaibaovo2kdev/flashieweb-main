'use client'
import { useCallback, useState, useMemo } from 'react'
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
  Chip,
} from '@nextui-org/react'
import { AiFillDelete, AiOutlinePlus } from 'react-icons/ai'
import dayjs from 'dayjs'
import { alert } from '~/utils/helpers'
import { useParams } from 'next/navigation'
import QrReaderModal from '~/components/common/QrReaderModal'
import BreadCrumbs from '~/components/layouts/Breadcrumb'
import ImportStudents from '~/components/ImportStudents'

import * as userAPI from '~/apis/user'
import * as courseAPI from '~/apis/courses'
import { FaFileDownload } from 'react-icons/fa'

const columns = [
  // { name: 'No.', uid: 'name' },
  { name: constants.column_name, uid: 'name' },
  { name: constants.column_createdate, uid: 'createdAt' },
  { name: constants.column_point, uid: 'point' },
  { name: constants.column_status, uid: 'status' },
  { name: constants.column_action, uid: 'actions' },
]

const statusColorMap = {
  accepted: 'success',
  pending: 'warning',
  deleted: 'danger',
  rejected: 'danger',
}

const CourseDetail = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'age',
    direction: 'ascending',
  })
  const [total, setTotal] = useState(0)
  const pages = Math.ceil(total / perPage) || 1

  const course = useQuery({
    queryKey: ['course-students', id],
    queryFn: () =>
      courseAPI.getStudents(id, { page, perPage }).then((res) => {
        setTotal(res.total)
        return res.data.map((i, index) => ({
          ...i,
          index: index + 1 + (page * perPage - perPage),
        }))
      }),
  })

  const handleDel = (studentId) => () => {
    alert.deleteComfirm({
      onDelete: () =>
        courseAPI
          .delStudent(id, studentId)
          .then(() => queryClient.refetchQueries(['course-students', id])),
    })
  }
  const handleAccept = (studentId) => async () => {
    try {
      await courseAPI.updateStudent(id, studentId, 'accepted')
      queryClient.refetchQueries(['course-students', id])
    } catch (error) {
      alert.error(
        error?.response?.data?.message || 'Failed to accepted student!'
      )
    }
  }
  const handleReject = (studentId) => async () => {
    try {
      await courseAPI.updateStudent(id, studentId, 'rejected')
      queryClient.refetchQueries(['course-students', id])
    } catch (error) {
      alert.error(
        error?.response?.data?.message || 'Failed to rejected student!'
      )
    }
  }

  const onQrResult = (courseId) => (code) => {
    userAPI.get(code).then(async (user) => {
      try {
        const { isConfirmed } = await alert.confirm(
          user.name,
          `Do you want add ${user.name} to course?`
        )
        if (isConfirmed) {
          await courseAPI.addStudent(courseId, user.id, 'pending')
          alert.success('Student has been added to course successfully!')
          queryClient.refetchQueries(['course-students', id])
        }
      } catch (error) {
        console.log(error?.response?.data?.message)
        alert.error(error?.response?.data?.message || 'Failed to add student!')
      }
    })
  }

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: user.avatar }}
            description={user.email}
            name={user.name}
          >
            {user.name}
          </User>
        )
      case 'active':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize text-default-400'>{}</p>
          </div>
        )
      case 'createdAt':
        return (
          <div className='flex flex-col'>
            {/* <p className='text-bold text-sm capitalize'>{cellValue}</p> */}
            <p className='text-bold text-sm capitalize text-default-400'>
              {dayjs(user.createdAt).format(constants.format_date)}
            </p>
          </div>
        )
      // case 'point':
      //   return (
      //     <div className='flex flex-col'>
      //       <p className='text-bold text-sm capitalize'>{user.point}</p>
      //     </div>
      //   )
      case 'status': {
        if (user.status === 'requested') {
          return (
            <div className='flex flex-row gap-1'>
              <Button size='sm' color='success' onPress={handleAccept(user.id)}>
                Accept
              </Button>
              <Button size='sm' color='danger' onPress={handleReject(user.id)}>
                Reject
              </Button>
            </div>
          )
        }
        return (
          <Chip
            className='capitalize'
            color={statusColorMap[user.status]}
            size='sm'
            variant='flat'
          >
            {cellValue}
          </Chip>
        )
      }

      case 'actions':
        if (user.status === 'requested') return null
        return (
          <div className='relative flex items-center gap-2'>
            {/* <Tooltip content='Edit user'>
              <Link href={`/my-room/courses/${id}/students/${user.id}`}>
                <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                  <AiFillEdit />
                </span>
              </Link>
            </Tooltip> */}
            <Tooltip color='danger' content='Delete student'>
              <span
                className='cursor-pointer text-lg text-danger active:opacity-50'
                onClick={handleDel(user.id)}
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
            <ImportStudents
              courseId={id}
              isOpen={true}
              onDone={() => queryClient.refetchQueries(['course-students'])}
            />
            <a href='/template_insert_student.xlsx' download>
              <div className='flex flex-row items-center justify-center gap-1 rounded-md border bg-slate-300 px-2 py-1'>
                <FaFileDownload />
                Template file
              </div>
            </a>
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
            <QrReaderModal onResult={onQrResult(id)} courseId={id}>
              {/* <Link href='/teacher/course-management/edit'> */}
              <Button color='primary' startContent={<AiOutlinePlus />}>
                Add New
              </Button>
              {/* </Link> */}
            </QrReaderModal>
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
