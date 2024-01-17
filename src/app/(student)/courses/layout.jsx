'use client'
import { Card, CardBody } from '@nextui-org/react'

const StudenLayout = ({ children }) => {
  return (
    <div className='flex w-full flex-row justify-center'>
      <Card className='mt-4 w-[calc(80vh-120px)] max-w-3xl'>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  )
}

export default StudenLayout
