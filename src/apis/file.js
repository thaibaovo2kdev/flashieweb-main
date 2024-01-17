import axios from 'axios'

function dataURLtoBlob(dataUrl) {
  return new Promise((r) => {
    const req = new XMLHttpRequest()
    req.open('GET', dataUrl)
    req.responseType = 'arraybuffer'
    req.onload = function fileLoaded(e) {
      const mime = this.getResponseHeader('content-type')
      r(new Blob([this.response], { type: mime }))
    }
    req.send()
  })
}

export async function uploads(files, progress) {
  const data = new FormData()

  for (const file of files) {
    if (typeof file === 'string') {
      const blob = await dataURLtoBlob(file)
      const extension = blob.type.split('/')[1]
      const f = new File([blob], `${Date.now()}.${extension}`, {
        type: blob.type,
      })
      data.append('file', f)
    } else {
      data.append('file', file)
    }
  }

  return axios({
    url: `/api/uploads`,
    timeout: 300000,
    method: 'POST',
    data,
    onUploadProgress: (progressEvent) => {
      if (typeof progress === 'function') {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        progress(percentCompleted)
      }
    },
  }).then((r) => r.data)
}
