'use client'
import React, { useCallback, useMemo } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Input,
} from '@nextui-org/react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect } from 'react'
import * as courseAPI from '~/apis/courses'
import { useQueryClient } from '@tanstack/react-query'
import { alert } from '~/utils/helpers'
import ImportStudents from '~/components/ImportStudents'
import { FaFileDownload } from 'react-icons/fa'

export default function QrReaderModal({ children, onResult, courseId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const queryClient = useQueryClient()

  const onNewScanResult = useCallback((result, decodedResult) => {
    // setState((s) => ({ ...s, result }))
    onResult?.(result, decodedResult)
  }, [])

  const addEmail = async () => {
    try {
      if (loading) return
      setLoading(true)
      await courseAPI.addStudent(courseId, email, 'accepted')
      alert.success('Student has been added to course successfully!')
      queryClient.refetchQueries(['course-students', courseId])
      setLoading(false)
    } catch (error) {
      setLoading(false)
      alert.error(error?.response?.data?.message || 'Failed to add student!')
    }
  }

  const handleChange = ({ target }) => setEmail(target.value)

  return (
    <>
      <div onClick={onOpen} className='relative'>
        {children}
        <div className='absolute bottom-0 left-0 right-0 top-0' />{' '}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                QRCode Scanner
              </ModalHeader>
              <ModalBody>
                <div className='flex w-full flex-row justify-start gap-1'>
                  <ImportStudents
                    courseId={courseId}
                    isOpen={true}
                    onDone={() =>
                      queryClient.refetchQueries(['course-students'])
                    }
                  />
                  <a href='/template_insert_student.xlsx' download>
                    <div className='flex flex-row items-center justify-center gap-1 rounded-md border bg-slate-300 px-2 py-1'>
                      <FaFileDownload />
                      Template file
                    </div>
                  </a>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <Input
                    type='text'
                    label='Student Email'
                    placeholder='Enter email address'
                    className='my-2'
                    name='name'
                    value={email || ''}
                    // errorMessage={errors.name}
                    onChange={handleChange}
                  />
                  <Button
                    color='primary'
                    isLoading={loading}
                    onPress={addEmail}
                  >
                    Invite
                  </Button>
                </div>
                <Html5QrcodePlugin
                  fps={10}
                  qrbox={250}
                  disableFlip={false}
                  qrCodeSuccessCallback={onNewScanResult}
                />
                {/* <QrReader
                  delay={state.delay}
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                  onError={handleError}
                  onScan={handleScan}
                /> */}
              </ModalBody>
              <ModalFooter>
                {/* <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={() => setImage('sdas')}>
                  Action
                </Button>
                 */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

const Html5QrcodePlugin = (props) => {
  const createConfig = () => {
    let config = {}
    if (props.fps) {
      config.fps = props.fps
    }
    if (props.qrbox) {
      config.qrbox = props.qrbox
    }
    if (props.aspectRatio) {
      config.aspectRatio = props.aspectRatio
    }
    if (props.disableFlip !== undefined) {
      config.disableFlip = props.disableFlip
    }
    return config
  }

  useEffect(() => {
    // when component mounts
    const config = createConfig()
    const verbose = props.verbose === true
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw 'qrCodeSuccessCallback is required callback.'
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'html5qr-code-full-region',
      config,
      verbose
    )
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    )

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner. ', error)
      })
    }
  }, [])

  return <div id={'html5qr-code-full-region'} />
}
