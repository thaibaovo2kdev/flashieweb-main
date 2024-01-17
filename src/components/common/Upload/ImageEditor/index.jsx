'use client'
import React from 'react'

import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage'

const Editor = ({ file, onDone, ...props }) => {
  const [loading, setLoading] = React.useState(false)
  const [imgSrc, setImgSrc] = React.useState(null)
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [aspect, setAspect] = React.useState(props?.aspect || 1)
  const autoDone = React.useRef(null)
  const croppedAreaPixels = React.useRef(null)

  const onCropComplete = React.useCallback(
    (croppedArea, _croppedAreaPixels) => {
      croppedAreaPixels.current = _croppedAreaPixels
    },
    []
  )

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result.toString() || '')
      )
      reader.readAsDataURL(file)
      // setAspect(file.width / file.height)
    }
  }, [file])

  React.useEffect(() => {
    if (autoDone.current) clearTimeout(autoDone.current)
    autoDone.current = setTimeout(() => {
      showCroppedImage()
    }, 1500)
  }, [crop, rotation, zoom])

  const showCroppedImage = async () => {
    try {
      if (loading) return
      setLoading(true)
      const croppedImage = await getCroppedImg(
        imgSrc,
        croppedAreaPixels.current,
        rotation
      )
      typeof onDone === 'function' && onDone(croppedImage)
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleAspectChange = ({ target }) => {
    setAspect(target.value)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Cropper
          image={imgSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          onCropChange={setCrop}
          aspect={aspect}
          showGrid={true}
          restrictPosition={true}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          // onMediaLoaded={(mediaSize) => {
          //   // Adapt zoom based on media size to fit max height
          //   onZoomChange(400 / mediaSize.naturalHeight)
          // }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 8,
          padding: 8,
        }}
      >
        <div
          style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 4 }}
        >
          <span>Zoom: </span>
          <input
            type='range'
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby='Zoom'
            onChange={(e) => {
              setZoom(e.target.value)
            }}
          />
        </div>
        <div
          style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 4 }}
        >
          <span>Rotation:</span>
          <input
            type='range'
            value={rotation}
            min={0}
            max={360}
            step={1}
            aria-labelledby='Rotation'
            onChange={(e) => {
              setRotation(e.target.value)
            }}
          />
        </div>
        <div
          style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 4 }}
        >
          <label for='aspect'>Aspect:</label>
          <select
            id='aspect'
            style={{ width: 90, backgroundColor: '#ddd', borderRadius: 4 }}
            value={aspect}
            onChange={handleAspectChange}
          >
            <option value={1}>1:1</option>
            <option value={4 / 5}>4:5</option>
            <option value={5 / 4}>5:4</option>
            <option value={16 / 9}>16:9</option>
            <option value={9 / 16}>9:16</option>
            <option value={820 / 312}>820:312</option>
          </select>
        </div>
        <button
          style={{
            backgroundColor: '#007fff',
            padding: '4px 8px',
            color: 'white',
            borderRadius: 4,
            alignSelf: 'flex-end',
          }}
          onClick={showCroppedImage}
        >
          DONE
        </button>
      </div>
    </div>
  )
}

export default React.memo(Editor)
