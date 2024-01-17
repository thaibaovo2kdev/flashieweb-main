'use client'
import { Spinner } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { FaFileUpload } from 'react-icons/fa'
// import { ReactSpreadsheetImport } from 'react-spreadsheet-import'
import * as flashCardAPI from '~/apis/flashcards'
import { alert } from '~/utils/helpers'
var xlsx = require('xlsx')
// import XLSX from 'xlsx'

export default function ImportCards({
  flashsetId,
  className = '',
  accept = '.xls, .xlsx',
  onDone,
  isOpen,
}) {
  const [open, setOpen] = useState(isOpen || false)
  const [loading, setLoading] = useState(false)
  const id = useRef(new Date().toISOString())
  const inputFileRef = useRef(null)

  // useEffect(() => {
  //   console.log(isOpen, 'isOpen')
  //   if (open) {
  //     console.log(open, 'open')
  //     setTimeout(() => {
  //       inputFileRef.current?.click?.()
  //     }, 2000)
  //   }
  // }, [isOpen])

  const handleFile = (evt) => {
    evt.preventDefault()

    const file = evt.target.files[0]

    if (file) {
      const reader = new FileReader()
      const rABS = !!reader.readAsBinaryString
      reader.onload = (e) => {
        // const data = e.target.result
        // const workbook = xlsx.read(data, { type: 'array' })
        // // organize xlsx data into desired format
        // workbook.SheetNames.forEach((sheet) => {
        //   const worksheet = workbook.Sheets[sheet]
        //   // format object
        //   console.log(worksheet)

        // })
        const bstr = e.target.result
        const wb = xlsx.read(bstr, { type: rABS ? 'binary' : 'array' })
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        // console.log(rABS, wb)
        /* Convert array of arrays */
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 })
        const cards = []
        for (let index = 1; index < data.length; index++) {
          const element = data[index]
          if (element[0] && element[1]) {
            cards.push({
              flashsetId,
              name: `Card ${index}`,
              frontText: element[0],
              backText: element[1],
            })
          }
        }

        if (cards.length === 0) {
          alert.error('Your data file is empty')
          return
        }

        // isLoad.current = true
        setLoading(true)
        flashCardAPI
          .create(cards)
          .then(() => {
            setLoading(false)
            alert.success(
              `${cards.length}/${
                data.length - 1
              } cards has been imported successfully!`
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
        style={{ cursor: 'pointer' }}
      >
        <input
          type='file'
          ref={inputFileRef}
          id={id.current}
          hidden
          accept={accept}
          //   onChange={handleFile}
        ></input>
        <div className='flex flex-row items-center justify-center gap-1 rounded-md border bg-slate-400 px-2 py-1'>
          {loading ? <Spinner size='sm' /> : <FaFileUpload />}
          Import file
        </div>
      </label>
      {/* <div
        className='relative'
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {children}
        <div className='absolute bottom-0 left-0 right-0 top-0 cursor-pointer' />
      </div> */}
      {/* <ReactSpreadsheetImport isOpen={isOpen} onSubmit={onSubmit} /> */}
    </>
  )
}
