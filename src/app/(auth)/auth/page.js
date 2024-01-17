'use client'
import { useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { alert } from '~/utils/helpers'
import { useRouter, useSearchParams } from 'next/navigation'

import * as Yup from 'yup'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const cb = searchParams.get('callback')
    const cbUrl = new URL(cb)

    onSubmit(
      {
        id: cbUrl.searchParams.get('uid'),
        name: cbUrl.searchParams.get('uname'),
        email: cbUrl.searchParams.get('uemail'),
        avatar: cbUrl.searchParams.get('uavatar'),
      },
      cb
    )
  }, [])

  const onSubmit = async (values, cbUrl) => {
    try {
      console.log(values, cbUrl)
      await signOut({ redirect: false })
      const res = await signIn('auth', {
        redirect: false,
        id: values.id,
        name: values.name,
        email: values.email,
        avatar: values.avatar,
      })
      if (res.error) throw new Error(res.error)
      console.log(cbUrl.split('&uid')[0], 'cbUrlcbUrlcbUrl')
      router.replace(cbUrl.split('&uid')[0])
    } catch (error) {
      alert.error(error.message)
      console.log(error.message, 'err')
    }
  }

  const schema = Yup.object().shape({
    email: Yup.string()
      .required('Required Field')
      .test('is-email', 'Invalid email', (value) => {
        if (value) {
          return value.includes('@')
            ? Yup.string().email('Invalid email').isValidSync(value)
            : Yup.string()
                .min(3, 'From 6 to 20 characters')
                .max(30, 'From 6 to 20 characters')
                .matches(
                  /^(?=[a-zA-Z0-9._]{6,20}$)[^_.].*[^_.]$/,
                  'Invalid user name'
                )
                .isValidSync(value)
        }
        return true
      }),
    password: Yup.string()
      .min(6, 'Your Password must be at least 6')
      .required('Enter your password'),
  })

  return null
}
