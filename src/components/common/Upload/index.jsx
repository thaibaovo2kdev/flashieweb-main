'use client'
import React, { memo } from 'react'
import Modal from './Modal'
import ImageEditor from './ImageEditor'

const Upload = ({
  onChange,
  onError,
  children,
  multiple = false,
  aspect = 4 / 3,
  accept = 'image/*,video/*',
}) => {
  const id = React.useRef(Math.random().toString(36).substring(7))
  const [file, setFile] = React.useState(null)

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files) {
      const files = Array.from(e.target.files)

      Promise.all(
        files.map((file) => {
          return new Promise((resolve) => {
            const res = file
            res.url = URL.createObjectURL(file)
            if (file.type.indexOf('image/') > -1) {
              const img = new Image()
              img.src = res.url
              img.onload = () => {
                res.width = img.width
                res.height = img.height
                resolve(res)
              }
            } else {
              const video = document.createElement('video')
              video.onerror = (e) => {
                resolve(res)
              }
              video.addEventListener(
                'loadedmetadata',
                function () {
                  res.width = this.videoWidth
                  res.height = this.videoHeight
                  video.remove()
                  resolve(res)
                },
                false
              )
              video.src = res.url
            }
          })
        })
      )
        .then((files) => {
          if (aspect) {
            setFile(files[0])
          } else {
            onChange && onChange(multiple ? files : files[0])
          }
        })
        .catch((e) => onError && onError(e))
      e.target.value = null
    }
  }

  const handleEditDone = (url) => {
    const res = file
    res.url = url
    if (file.type.indexOf('image/') > -1) {
      const img = new Image()
      img.src = res.url
      img.onload = () => {
        res.width = img.width
        res.height = img.height
        onChange?.(res)
        setFile(null)
      }
    }
  }

  return (
    <>
      <label
        htmlFor={id.current}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        {children}
        <div
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
        />
      </label>
      <input
        id={id.current}
        style={{ display: 'none' }}
        type='file'
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />

      <Modal isOpen={!!file} onClose={() => setFile(null)}>
        <ImageEditor file={file} aspect={aspect} onDone={handleEditDone} />
      </Modal>
    </>
  )
}

export default memo(Upload)
