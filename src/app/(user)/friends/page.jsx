'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import {
  Select,
  SelectItem,
  Input,
  RadioGroup,
  Radio,
  Button,
  Card,
  CardBody,
  Spinner,
  TableHeader,
  Table,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  User,
} from '@nextui-org/react'
import React, { useMemo, useState, useCallback } from 'react'

import { useSession } from 'next-auth/react'
import * as userAPI from '~/apis/user'

const Profile = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const session = useSession()
  const router = useRouter()

  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const [total, setTotal] = useState(0)

  const score = useQuery({
    queryKey: ['my-friends', page, perPage],
    queryFn: () =>
      userAPI.getFriends('me', { page, perPage }).then((res) => {
        setTotal(res.total)
        return res.data.map((i, index) => ({
          ...i,
          index: index + 1 + (page * perPage - perPage),
        }))
      }),
  })

  const pages = Math.ceil(total / perPage) || 1

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

  const renderCell = useCallback((cell, columnKey) => {
    const cellValue = cell[columnKey]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ src: cell.avatar }}
            name={cell.name}
            description={cell.email}
          />
        )
      case 'score':
        return <p>{cell.score}</p>
      case 'index':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize text-default-400'>
              {cell.index}
            </p>
          </div>
        )
      case 'type':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize text-default-400'>
              {cell.parentKey}
            </p>
          </div>
        )

      // case 'actions':
      //   return (
      //     <div className='relative flex items-center gap-2'>
      //       <Tooltip content='Edit'>
      //         <Link href={`/teacher/flashset-management/edit?id=${cell.id}`}>
      //           <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
      //             <BiSolidEdit />
      //           </span>
      //         </Link>
      //       </Tooltip>

      //       <Tooltip content='Add flash card'>
      //         <Link href={`/teacher/flashset-management/${cell.id}/cards`}>
      //           <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
      //             <BiSolidLayerPlus />
      //           </span>
      //         </Link>
      //       </Tooltip>
      //       <Tooltip color='danger' content='Delete'>
      //         <span
      //           className='cursor-pointer text-lg text-default-400 active:opacity-50'
      //           onClick={handleDel(cell.id)}
      //         >
      //           <BiTrash />
      //         </span>
      //       </Tooltip>
      //     </div>
      //   )
      default:
        return cellValue
    }
  }, [])

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

  if (session.status === 'loading') return null

  return (
    <Table
      aria-label=''
      className='mt-4'
      isHeaderSticky
      // topContent={topContent}
      // topContentPlacement='outside'
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      // classNames={{
      //   wrapper: 'bg-blue-100 p-0 rounded-md border-2 border-[#5E9DD0]',
      //   thead: '[&>tr]:first:shadow-none',
      //   th: [
      //     'bg-transparent',
      //     'font-semibold',
      //     'text-slate-700',
      //     'border-b-2',
      //     'border-divider',
      //     'border-[#5E9DD0] ',
      //   ],
      // }}
    >
      <TableHeader
        columns={[
          { name: 'No.', uid: 'index' },
          { name: 'Name', uid: 'name' },
          // { name: 'Type', uid: 'type' },
          // { name: 'Point', uid: 'score' },
          // { name: 'ACCESS', uid: 'type' },
          // { name: 'Status', uid: 'status' },
          // { name: '', uid: 'actions' },
        ]}
      >
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'end' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={score.data || []}
        emptyContent={score.isLoading || 'No data to display.'}
        isLoading={score.isLoading}
        loadingContent={<Spinner label='Loading...' />}
      >
        {(item) => (
          <TableRow key={item.index}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default Profile
