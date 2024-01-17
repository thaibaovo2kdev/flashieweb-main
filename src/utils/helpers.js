'use client'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useEffect, useState, useCallback } from 'react'

export const slug = (str) => {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆaàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;'
  const to =
    'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAaaaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}
export const copyToClipboard = (text) => {
  navigator?.clipboard?.writeText?.(text)
  alert.success('Copied!')
}
export const errorResponse = (error) => {
  if (axios.isAxiosError(error)) {
    let message = error.response ? error.response.data.message : error.message
    throw new Error(message)
  } else if (error instanceof Error) {
    // console.log(error.message, "-", );
    throw new Error(error.message)
  } else {
    throw new Error('Server Error Occurred!')
  }
}

const alertConfig = {
  width: 500,
  iconColor: 'white',
  showCancelButton: true,
  margin: '0 !important',
  confirmButtonColor: '#2196F3',
}
export const alert = {
  success: (text) =>
    toast.success(text, { position: toast.POSITION.TOP_RIGHT }),
  error: (text) => toast.error(text, { position: toast.POSITION.TOP_RIGHT }),
  confirm: (title = '', message, options = {}) => {
    const {
      icon,
      confirmButtonText = 'OK',
      cancelButtonText = 'Cancel',
    } = options
    return Swal.fire({
      ...alertConfig,
      title,
      icon,
      showConfirmButton: true,
      focusConfirm: false,
      reverseButtons: true,
      confirmButtonText,
      html: `<p style="margin-top: 16px !important;">${message ?? ''}</p>`,
      cancelButtonText,
      cancelButtonColor: '#666',
      customClass: {
        title: 'swal-title-custom',
        icon: 'swal-icon-custom',
        // icon: !icon.includes('error') ? 'swal-icon-custom' : 'swal-icon-custom-error',
        popup: 'swal-popup-custom',
        // confirmButton: showConfirmButton ? 'swal-confirm-button-custom' : undefined,
        // cancelButton: 'swal-cancel-button-custom'
      },
    })
  },
  warning: (title = '', message) => {
    if (!message) return Swal.fire(title)
    return Swal.fire(title, message, 'warning')
    // return Swal.fire({
    //   ...alertConfig,
    //   title,
    //   icon,
    //   showConfirmButton: true,
    //   focusConfirm: false,
    //   reverseButtons: true,
    //   confirmButtonText,
    //   html: `<p style="margin-top: 16px !important;">${message ?? ''}</p>`,
    //   cancelButtonText,
    //   cancelButtonColor: '#666',
    //   customClass: {
    //     title: 'swal-title-custom',
    //     icon: 'swal-icon-custom',
    //     // icon: !icon.includes('error') ? 'swal-icon-custom' : 'swal-icon-custom-error',
    //     popup: 'swal-popup-custom',
    //     // confirmButton: showConfirmButton ? 'swal-confirm-button-custom' : undefined,
    //     // cancelButton: 'swal-cancel-button-custom'
    //   },
    // })
  },
  deleteComfirm: ({ title = '', message, onDelete }) => {
    return Swal.fire({
      title: title || 'Are you sure?',
      text: message || "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return onDelete?.().catch((error) => {
          Swal.showValidationMessage(`Request failed: ${error}`)
        })
      },
    })
  },
}

export const concat = (preArray, nextArray, key) => {
  return [...nextArray, ...preArray].filter(
    (
      (s) => (a) =>
        !s.has(a[key] || a['id'] || a['_id']) &&
        s.add(a[key] || a['id'] || a['_id'])
    )(new Set())
  )
}

export const numberFormat = (n) => {
  if (n < 1e3) return n
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K'
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
}
export const urlify = (text) => {
  return text.match(/(https?:\/\/[^\s]+)/g)
}

export const shuffle = (arr) => {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

export const useDebounceEffect = (fn, waitTime, deps) => {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount
  return {
    ...windowSize,
    isLoading: !windowSize.width,
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width > 1024,
  }
}

const getLang = (txt) => {
  const regexKorean =
    /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g
  if (txt.match(regexKorean)) return 'ko'

  if (
    txt
      .split('')
      .filter((char) => /\p{Script=Han}/u.test(char))
      .join('') === txt
  )
    return 'zh-CN'

  const regexJP = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/
  if (regexJP.test(txt)) return 'ja-JP'

  return 'en'
}

export const speak = (text) => {
  if (!text) return
  // const t = '世界'
  // console.log(getLang(text), 'getlengf')
  new Audio(
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=${getLang(
      text
    )}&client=tw-ob`
  ).play()
}
export const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const useTabActive = () => {
  const [visibilityState, setVisibilityState] = useState(true)

  const handleVisibilityChange = useCallback(() => {
    setVisibilityState(document.visibilityState === 'visible')
  }, [])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return visibilityState
}
