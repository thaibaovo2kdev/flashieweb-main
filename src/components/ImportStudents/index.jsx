'use client'
import { Button, Spinner } from '@nextui-org/react'
import React, { useRef, useState } from 'react'
import { FaFileUpload } from 'react-icons/fa'
import * as courseAPI from '~/apis/courses'
import { alert } from '~/utils/helpers'
var xlsx = require('xlsx')

export default function ImportStudents({
  courseId,
  className = '',
  accept = '.xls, .xlsx',
  onDone,
  isOpen,
}) {
  const [open, setOpen] = useState(isOpen || false)
  const [loading, setLoading] = useState(false)
  const id = useRef(new Date().toISOString())
  const inputFileRef = useRef(null)

  const handleFile = (evt) => {
    evt.preventDefault()

    const file = evt.target.files[0]

    if (file) {
      const reader = new FileReader()
      const rABS = !!reader.readAsBinaryString
      reader.onload = (e) => {
        const bstr = e.target.result
        const wb = xlsx.read(bstr, { type: rABS ? 'binary' : 'array' })

        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]

        const data = xlsx.utils.sheet_to_json(ws, { header: 1 })
        console.log(data)
        const students = []
        for (let index = 1; index < data.length; index++) {
          const element = data[index]
          if (element[0]) {
            students.push({
              email: element[0],
              // password: element[1],
            })
          }
        }

        if (students.length === 0) {
          alert.error('Your data file is empty')
          return
        }

        setLoading(true)
        courseAPI
          .importStudents(courseId, students)
          .then(() => {
            setLoading(false)
            alert.success(
              `${students.length}/${
                data.length - 1
              } students has been imported successfully!`
            )
            onDone?.()
            document.getElementById(id.current).value = null
          })
          .catch(() => {
            setLoading(false)
            document.getElementById(id.current).value = null
            alert.error('Failed to import')
          })
      }
      if (rABS) reader.readAsBinaryString(file)
      else reader.readAsArrayBuffer(file)
      //   reader.readAsArrayBuffer(evt.target.files[0])
    }
  }

  return (
    <>
      <label
        htmlFor={id.current}
        onChange={handleFile}
        className={className}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <input
          type='file'
          ref={inputFileRef}
          id={id.current}
          hidden
          accept={accept}
        ></input>
        <Button>
          {loading ? <Spinner size='sm' /> : <FaFileUpload />} Import file
        </Button>
        <div className='absolute bottom-0 left-0 right-0 top-0' />
        {/* <div className='flex flex-row items-center justify-center gap-1 rounded-md border bg-slate-400 px-2 py-1'>
          {loading ? <Spinner size='sm' /> : <FaFileUpload />}
          Import file
        </div> */}
      </label>
    </>
  )
}
