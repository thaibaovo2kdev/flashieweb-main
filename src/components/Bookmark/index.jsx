'use client'
import { Button } from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import * as bookmarkAPI from '~/apis/bookmark'

export default function Bookmark({ isBookmark, parentType, parentId, size }) {
  const [isBookmarked, setIsBookmarked] = useState(isBookmark || false)
  const create = useMutation(() => bookmarkAPI.create(parentId, parentType), {
    onError: (error) => {
      setIsBookmarked(false)
      console.log(error)
      alert.error('Failed to create!')
    },
  })
  const del = useMutation(() => bookmarkAPI.del(parentId, parentType), {
    onError: (error) => {
      setIsBookmarked(true)
      console.log(error)
      alert.error('Failed to create!')
    },
  })

  const handleBookmark = () => {
    if (create.isLoading) return
    setIsBookmarked(true)
    create.mutate({ parentId, parentType })
  }
  const handleDelBookmark = () => {
    if (del.isLoading) return
    setIsBookmarked(false)
    del.mutate({ parentId, parentType })
  }

  return isBookmarked ? (
    <Button isIconOnly onPress={handleDelBookmark} variant='light' size='sm'>
      <BsBookmarkFill size={size || 24} color='#FFC700' />
    </Button>
  ) : (
    <Button isIconOnly onPress={handleBookmark} variant='light' size='sm'>
      <BsBookmark size={size || 24} />
    </Button>
  )
}
