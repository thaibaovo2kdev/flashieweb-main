'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import PageLayout from '~/components/layouts/PageLayout'

const StudentLayout = ({ children }) => {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('view_mode') === 'full') {
      window.sessionStorage.setItem('view_mode', 'full')
    }
  }, [])

  if (searchParams.get('view_mode') === 'full') return children
  if (window.sessionStorage.getItem('view_mode') === 'full') return children

  return <PageLayout hideNavigator>{children}</PageLayout>
}

export default StudentLayout
