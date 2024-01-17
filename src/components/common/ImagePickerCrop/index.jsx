'use client'
import React, { useRef, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react'
import { BsCloudUploadFill } from 'react-icons/bs'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from '~/utils/helpers'
import 'react-image-crop/dist/ReactCrop.css'

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

export default function ImagePickerCrop({ children, onChange, aspect = 1 }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  // const [aspect, setAspect] = useState(16 / 9)
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const blobUrlRef = useRef('')
  const id = useRef(new Date().toISOString())
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        )
      }
    },
    100,
    [completedCrop, scale, rotate]
  )

  async function handleDone() {
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist')
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    )
    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    )
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    })

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
    }
    blobUrlRef.current = URL.createObjectURL(blob)
    onChange?.({ blobUrl: blobUrlRef.current })
    console.log({ blobUrl: blobUrlRef.current })
    onClose()
  }

  const renderDefaultIcon = () => {
    return (
      <div className='flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 bg-gray-200 p-8'>
        <BsCloudUploadFill size={50} />
      </div>
    )
  }

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '')
        onOpen()
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }
  const onImageLoad = (e) => {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  return (
    <>
      <div>
        <label htmlFor={id.current}>{children || renderDefaultIcon()}</label>
        <input
          id={id.current}
          accept='image/*'
          type='file'
          name='photo'
          style={{ display: 'none' }}
          onChange={onSelectFile}
        />
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Image Editor
                </ModalHeader>
                <ModalBody>
                  {!!completedCrop && (
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        // display: 'none',
                        position: 'absolute',
                        // border: '1px solid black',
                        objectFit: 'contain',
                        width: completedCrop.width,
                        height: completedCrop.height,
                      }}
                    />
                  )}
                  {!!imgSrc && (
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspect}
                      // minWidth={400}
                      minHeight={200}
                    >
                      <img
                        ref={imgRef}
                        alt='Crop me'
                        src={imgSrc}
                        style={{
                          transform: `scale(${scale}) rotate(${rotate}deg)`,
                        }}
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                  )}

                  <div className='flex flex-row gap-4'>
                    <div className='flex flex-1 flex-col'>
                      <span>Scale</span>
                      <input
                        type='range'
                        defaultValue={scale}
                        min={1}
                        max={100}
                        step={1}
                        onChange={(e) =>
                          setScale(1 + (e.target.value * 3) / 100)
                        }
                      />
                    </div>
                    <div className='flex flex-1 flex-col'>
                      <span>Rotate</span>
                      <input
                        type='range'
                        defaultValue={scale}
                        min={0}
                        max={360}
                        step={1}
                        onChange={(e) => setRotate(e.target.value)}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color='primary' onPress={handleDone}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
