'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { alert, copyToClipboard } from '~/utils/helpers'
import {
  Select,
  SelectItem,
  Input,
  RadioGroup,
  Radio,
  Button,
  Card,
  CardBody,
  Avatar,
} from '@nextui-org/react'
import React, { useEffect } from 'react'
import { Formik } from 'formik'
import dayjs from 'dayjs'
import QRCode from 'qrcode.react'

import * as Yup from 'yup'
import * as userAPI from '~/apis/user'
import * as fileAPI from '~/apis/file'
import { useSession } from 'next-auth/react'
import constants from '~/utils/constants'
import Upload from '~/components/common/Upload'
import { MdEdit } from 'react-icons/md'

const Profile = () => {
  const queryClient = useQueryClient()
  const session = useSession()
  const router = useRouter()

  const update = useMutation(
    (values) => userAPI.update(session.data.user?.id, values),
    {
      onMutate: async (values) => {
        if (typeof values.avatar != 'string') {
          values.avatar = await fileAPI
            .uploads([values.avatar])
            .then((r) => r[0].url)
        }
        return values
      },
      onSuccess: (res) => {
        alert.success('Profile has been updated successfully!')
        session.update({ user: res })
        // queryClient.refetchQueries(['my-courses'])
        // router.replace('/courses')
      },
      onError: (error) => {
        console.log(error)
        alert.error('Failed to update!')
      },
    }
  )

  const handleSubmit = (values) => {
    if (values.birthday) {
      values.birthday = new Date(values.birthday).toISOString()
    }
    update.mutate(values)
  }
  const editSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'From 2 to 20 characters')
      .max(20, 'From 2 to 20 characters')
      .required('Enter your user name'),
    username: Yup.string()
      .min(3, 'From 3 to 20 characters')
      .max(20, 'From 3 to 20 characters')
      .matches(/^(?=[a-zA-Z0-9._]{2,20}$)[^_.].*[^_.]$/, 'Invalid user name')
      .required('Enter your user name'),
    email: Yup.string().email().required('Enter your email'),
  })

  if (session.status === 'loading') return null
  return (
    <Card>
      <CardBody>
        <Formik
          onSubmit={handleSubmit}
          initialValues={session.data?.user}
          enableReinitialize={true}
          validationSchema={editSchema}
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
            <div className='flex w-full flex-col'>
              <div className='flex flex-col gap-2 md:flex-row'>
                <div className='flex flex-1 flex-col'>
                  <div className='relative mb-2 self-center'>
                    <Upload
                      onChange={(file) =>
                        handleChange({
                          target: { name: 'avatar', value: file },
                        })
                      }
                    >
                      <div className='relative h-20 w-20'>
                        <Avatar
                          src={
                            typeof values.avatar == 'string'
                              ? values.avatar
                              : values.avatar.url
                          }
                          className='h-20 w-20'
                        />
                        <div className='absolute bottom-0 right-0 z-10 rounded-full border bg-white p-2'>
                          <MdEdit size={14} />
                        </div>
                      </div>
                    </Upload>
                  </div>
                  <Input
                    type='text'
                    label='Name'
                    placeholder='Enter your name'
                    className='my-2'
                    name='name'
                    errorMessage={errors.name}
                    value={values.name || ''}
                    onChange={handleChange}
                  />
                  <Input
                    type='text'
                    label={constants.user_name}
                    placeholder={'Enter your ' + constants.user_name}
                    className='my-2'
                    name={'username'}
                    errorMessage={errors.username}
                    value={values.username || ''}
                    onChange={handleChange}
                  />
                  <Input
                    type='date'
                    label='Birthday'
                    placeholder={constants.format_date}
                    className='my-2'
                    name='birthday'
                    defaultValue={dayjs(values.birthday).format('YYYY-MM-DD')}
                    // value={dayjs(values.birthday).format('YYYY-MM-DD')}
                    // onChange={handleChange}
                    onValueChange={(value) =>
                      handleChange({ target: { value, name: 'birthday' } })
                    }
                  />
                  <Input
                    type='text'
                    label='Phone'
                    placeholder='Enter your phone number'
                    className='my-2'
                    name='phone'
                    value={values.phone || ''}
                    onChange={handleChange}
                  />
                  <Input
                    type='email'
                    label='Email'
                    placeholder='Enter your email'
                    className='my-2'
                    name='email'
                    errorMessage={errors.email}
                    value={values.email || ''}
                    onChange={handleChange}
                  />
                  {/* <Input
                    type='text'
                    label='Talksam ID'
                    placeholder='Enter your talksam Id'
                    className='my-2'
                    name='talksamId'
                    value={values.talksamId || ''}
                    onChange={handleChange}
                  /> */}
                  {/* <Input
                    type='text'
                    label='Level'
                    // placeholder='Enter your email'
                    className='my-2'
                    name='level'
                    value={values?.attributes?.level?.toUpperCase?.() || ''}
                    // isDisabled
                    // onChange={handleChange}
                  /> */}
                </div>
                <div className='ml-2 flex flex-1 flex-col items-center'>
                  <QRCode value={session.data.user.id} size={200} />
                  <div className='mt-4 flex flex-row'>
                    <Input
                      disabled
                      color='default'
                      type='text'
                      defaultValue={session.data.user.id}
                      placeholder=''
                      className='max-w-xs'
                    />
                    <Button
                      className='ml-4'
                      onPress={() => {
                        copyToClipboard(session.data.user.id)
                        alert.success('Copied!')
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className='mt-4 flex flex-row'>
                    <label
                      className='ml-2 flex flex-1 flex-col items-center'
                      style={{ fontStyle: 'italic', fontSize: 14 }}
                    >
                      You may save this QR code for related functions (ex:
                      adding users in class)
                    </label>
                  </div>
                </div>
              </div>

              <Button
                type='submit'
                color='primary'
                className='mt-6 w-max'
                isLoading={update.isLoading}
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>
          )}
        </Formik>
      </CardBody>
    </Card>
  )
}

export default Profile
