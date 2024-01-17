'use client'
import { Spinner } from '@nextui-org/react'
import React, { useRef, useState } from 'react'
import { FaFileUpload } from 'react-icons/fa'
import * as userAPI from '~/apis/user'
import { alert } from '~/utils/helpers'
var xlsx = require('xlsx')

export default function ImportStudents({
  className = '',
  accept = '.xls, .xlsx',
  onDone,
}) {
  const [loading, setLoading] = useState(false)
  const id = useRef(new Date().toISOString())
  const inputFileRef = useRef(null)

  const handleFile = (evt) => {
    evt.preventDefault()

    const file = evt.target.files[0]

    if (file) {
      id.current = new Date().toISOString()
      const reader = new FileReader()
      const rABS = !!reader.readAsBinaryString
      reader.onload = (e) => {
        const bstr = e.target.result
        const wb = xlsx.read(bstr, { type: rABS ? 'binary' : 'array' })

        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]

        const data = xlsx.utils.sheet_to_json(ws, { header: 1 })
        const students = []
        for (let index = 1; index < data.length; index++) {
          const element = data[index]
          if (element[0] && element[1]) {
            students.push({
              email: element[0],
              password: element[1],
              type: element[2] || 'student',
            })
          }
        }

        if (students.length === 0) {
          alert.error('Your data file is empty')
          return
        }

        setLoading(true)
        userAPI
          .importUsers(students)
          .then((newUsers) => {
            setLoading(false)
            if (newUsers?.length < students.length) {
              alert.success(
                `${newUsers.length} users has been imported. ${
                  students.length - newUsers?.length
                } already exists.`
              )
            } else {
              alert.success(
                `${students.length}/${
                  data.length - 1
                } users has been imported successfully!`
              )
            }

            onDone?.()
            document.getElementById(id.current).value = null
          })
          .catch(() => {
            setLoading(false)
            alert.error('Failed to import')
            document.getElementById(id.current).value = null
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
        style={{ cursor: 'pointer' }}
      >
        <input
          type='file'
          ref={inputFileRef}
          id={id.current}
          hidden
          accept={accept}
        ></input>
        <div className='flex flex-row items-center justify-center gap-1 rounded-md border bg-slate-400 px-2 py-1'>
          {loading ? <Spinner size='sm' /> : <FaFileUpload />}
          Import file
        </div>
      </label>
    </>
  )
}
