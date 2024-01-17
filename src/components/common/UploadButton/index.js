'use client'
import { memo, useState, useCallback, useRef } from 'react'

const UploadButton = ({
  children,
  className,
  onChange,
  accept = 'image/*',
}) => {
  const id = useRef(new Date().toISOString())
  const handleFile = async (event) => {
    if (event.target.files.length === 0) return
    console.log(event.target.files, 'file')
    onChange && onChange(event.target.files[0])
  }

  return (
    <label
      onChange={handleFile}
      htmlFor={id.current}
      style={{ cursor: 'pointer' }}
      className={className}
    >
      <input type='file' id={id.current} hidden accept={accept} />
      {children}
    </label>
  )
}

export default memo(UploadButton)
