'use client'
import { Button, Input } from '@nextui-org/react'
import { Formik, Form } from 'formik'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import * as Yup from 'yup'
import { alert } from '~/utils/helpers'

import * as authAPI from '~/apis/auth'
import constants from '~/utils/constants'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSent, setIsSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const onResetPassword = async (values) => {
    try {
      if (loading) return
      setLoading(true)
      await authAPI.resetPassword(values.email)
      setIsSent(true)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      alert.error(error?.response?.data?.message)
    }
  }

  const onChangePassword = async (values) => {
    try {
      if (values.password !== values.confirm_password) {
        alert.error('The password confirmation does not match.')
        return
      }
      if (loading) return
      setLoading(true)
      await authAPI.updatePassword(values.password, searchParams.get('token'))
      setLoading(false)
      router.replace('/login')
    } catch (error) {
      setLoading(false)
      alert.error(error?.response?.data?.message)
    }
  }

  if (isSent) {
    return (
      <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
        <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
          Reset Password
        </h1>
        <div className='bg-blue-100 p-2'>
          If your email address exists in our database, you will receive a
          password recovery link at your email address in a few minutes.
        </div>

        <Button
          onClick={() => router.replace('/login')}
          className='w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
        >
          Back to Login
        </Button>
      </div>
    )
  }

  if (searchParams.get('token')) {
    const changePasswordSchema = Yup.object().shape({
      password: Yup.string()
        .min(6, 'New Password must be at least 6')
        .required('Enter new password'),
      confirm_password: Yup.string()
        .min(6, 'New Password must be at least 6')
        .required('Enter confirm password'),
    })
    return (
      <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
        <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
          Change Your Password
        </h1>
        <Formik
          onSubmit={onChangePassword}
          initialValues={{ password: '', confirm_password: '' }}
          enableReinitialize={true}
          validationSchema={changePasswordSchema}
        >
          {({ values, errors, handleChange, handleSubmit }) => (
            <Form className='space-y-4 md:space-y-6'>
              <Input
                type='password'
                name='password'
                label='New Password'
                placeholder='••••••••'
                required=''
                value={values.password}
                errorMessage={errors.password}
                onChange={handleChange}
              />
              <Input
                type='password'
                name='confirm_password'
                label='Confirm New Password'
                placeholder='••••••••'
                required=''
                value={values.confirm_password}
                errorMessage={errors.confirm_password}
                onChange={handleChange}
              />

              <Button
                isLoading={loading}
                onClick={handleSubmit}
                className='w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                Change Password
              </Button>
              <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                {constants.page_already_have_an_account}{' '}
                <Link
                  href='/login'
                  className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                >
                  {constants.button_signin}
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    )
  }

  const schema = Yup.object().shape({
    email: Yup.string().email().required('Enter your email'),
  })
  return (
    <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
      <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
      {constants.forgot_password}
      </h1>
      <Formik
        onSubmit={onResetPassword}
        initialValues={{ email: '' }}
        enableReinitialize={true}
        validationSchema={schema}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <Form className='space-y-4 md:space-y-6'>
            <Input
              type='email'
              name='email'
              label='Email'
              placeholder='name@company.com'
              required=''
              value={values.email}
              errorMessage={errors.email}
              onChange={handleChange}
            />

            <Button
              isLoading={loading}
              onClick={handleSubmit}
              className='w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            >
              {constants.resetPassword}
            </Button>
            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
            {constants.page_already_have_an_account}{' '}
              <Link
                href='/login'
                className='font-medium text-primary-600 hover:underline dark:text-primary-500'
              >
                {constants.button_signin}
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}
