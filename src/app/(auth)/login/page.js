'use client'
import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { alert } from '~/utils/helpers'
import { useRouter } from 'next/navigation'
import { Formik, Form } from 'formik'

import * as Yup from 'yup'
import constants from '~/utils/constants'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const onSubmit = async (values) => {
    try {
      if (loading) return
      setLoading(true)
      const res = await signIn('sign-in', {
        redirect: false,
        email: values.email,
        password: values.password,
      })
      if (res.error) throw new Error(res.error)
      router.replace('/')
    } catch (error) {
      setLoading(false)
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

  return (
    <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
      <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
        {constants.button_signin}
      </h1>
      <Formik
        onSubmit={onSubmit}
        initialValues={{ email: '', password: '' }}
        enableReinitialize={true}
        validationSchema={schema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form className='space-y-4 md:space-y-6' action='#'>
            <Input
              type='email'
              name='email'
              label='User name/Email'
              placeholder='name@company.com'
              required=''
              value={values.email}
              errorMessage={errors.email}
              onChange={handleChange}
            />
            <Input
              type='password'
              name='password'
              label='Password'
              placeholder='••••••••'
              required=''
              value={values.password}
              errorMessage={errors.password}
              onChange={handleChange}
            />

            <div className='flex items-center justify-between'>
              <div className='flex items-start'>
                <div className='flex h-5 items-center'>
                  <input
                    id='remember'
                    aria-describedby='remember'
                    type='checkbox'
                    className='focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600'
                    required=''
                  />
                </div>
                <div className='ml-3 text-sm'>
                  <label
                    htmlFor='remember'
                    className='text-gray-500 dark:text-gray-300'
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <Link
                href={'/reset-password'}
                className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'
              >
                Forgot password?
              </Link>
            </div>
            <Button
              isLoading={loading}
              onClick={handleSubmit}
              type='submit'
              fullWidth
              color='primary'
            >
              Sign in
            </Button>
            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
              Don’t have an account yet?{' '}
              <Link
                href='/signup'
                className='font-medium text-primary-600 hover:underline dark:text-primary-500'
              >
                {constants.button_signup}
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}
