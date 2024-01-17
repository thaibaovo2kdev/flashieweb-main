'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { alert } from '~/utils/helpers'
import * as courseAPI from '~/apis/courses'
import {
  Select,
  SelectItem,
  Input,
  RadioGroup,
  Radio,
  Button,
  Card,
  CardBody,
  Spinner,
} from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { Formik } from 'formik'
import ImagePickerCrop from '~/components/common/ImagePickerCrop'
import BreadCrumbs from '~/components/layouts/Breadcrumb'
import FlashsetSelector from '~/components/FlashsetSelector'
import CourseSelector from '~/components/CourseSelector'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'

import Image from 'next/image'

import * as Yup from 'yup'
import * as fileAPI from '~/apis/file'
import * as gameAPI from '~/apis/games'
import config from '~/utils/config'
import constants from '~/utils/constants'

const types = [
  { key: 'matching1', name: 'Match Flash' },
  { key: 'matching2', name: 'Flip Flop' },
]

const GameEdit = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const disabled = useRef(false)

  const [loading, setLoading] = React.useState(true)
  const [state, setState] = React.useState({
    image: '',
    name: '',
    level: 'sprout_a',
    type: 'matching1',
    status: 'active',
  })

  const [selected, setSelected] = useState([])
  const [selectedCourse, setSelectedCourse] = useState([])

  useEffect(() => {
    if (id) {
      gameAPI.readById(id).then((r) => {
        setState({
          name: r.name,
          image: r.image,
          type: r.type,
          level: r.level,
          status: r.status,
        })
        setLoading(false)
      })
    } else setLoading(false)
  }, [])

  const create = useMutation((values) => gameAPI.create(values), {
    onMutate: async (values) => {
      disabled.current = true
      if (values.image?.includes?.('blob:')) {
        values.image = await fileAPI
          .uploads([values.image])
          .then((r) => r[0].url)
      }
      return values
    },
    onSuccess: (res) => {
      alert.success('Game has been created successfully!')
      queryClient.refetchQueries(['game-management'])
      router.replace('/teacher/game-management')
    },
    onError: (error) => {
      disabled.current = false
      console.log(error)
      alert.error(error?.response?.data?.message || 'Failed to create!')
    },
  })

  const update = useMutation((values) => gameAPI.update(id, values), {
    onMutate: async (values) => {
      disabled.current = true
      if (values.image?.includes?.('blob:')) {
        values.image = await fileAPI
          .uploads([values.image])
          .then((r) => r[0].url)
      }
      return values
    },
    onSuccess: (res) => {
      alert.success('Game has been updated successfully!')
      queryClient.refetchQueries(['game-management'])
      router.replace('/teacher/game-management')
    },
    onError: (error) => {
      disabled.current = false
      console.log(error)
      alert.error('Failed to update!')
    },
  })

  const handleSubmit = (values) => {
    if (disabled.current) return
    values.flashsetIds = selected.map((i) => i.id)
    values.courseIds = selectedCourse.map((i) => i.id)
    if (!id) create.mutate(values)
    else update.mutate(values)
  }
  const editSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'From 3 to 30 character')
      .max(30, 'From 3 to 30 character')
      .required('Enter game name'),
    image: Yup.string().required('Image required'),
    type: Yup.string().required('Type required'),
  })

  if (loading) return <Spinner size='lg' />
  return (
    <>
      <BreadCrumbs />
      <Card>
        <CardBody>
          <Formik
            onSubmit={handleSubmit}
            initialValues={state}
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
                <div className='flex flex-row'>
                  <div className='mr-2 flex flex-1 flex-col'>
                    <Input
                      type='text'
                      label='Game name'
                      placeholder='Enter game name'
                      className='my-2'
                      name='name'
                      value={values.name || ''}
                      errorMessage={errors.name}
                      onChange={handleChange}
                    />

                    {!id && (
                      <>
                        <p>Flash Sets:</p>
                        <div className='flex flex-row flex-wrap gap-2'>
                          {selected.map((i) => (
                            <div
                              key={i.id}
                              className='relative flex w-24 flex-col rounded border'
                            >
                              <Image
                                src={i.image}
                                width={80}
                                height={80}
                                className='aspect-square w-24'
                              />

                              <p className='min-w-full text-center text-xs'>
                                {i.name}
                              </p>
                              <div
                                className='absolute right-0 top-0 cursor-pointer rounded-full bg-red-300 p-1'
                                onClick={() =>
                                  setSelected((s) =>
                                    s.filter((k) => k.id !== i.id)
                                  )
                                }
                              >
                                <AiOutlineClose size={15} />
                              </div>
                            </div>
                          ))}

                          <FlashsetSelector
                            onSelect={(s) => setSelected((i) => [...i, ...s])}
                          >
                            <div className='relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded border bg-gray-300'>
                              <AiOutlinePlus />
                            </div>
                          </FlashsetSelector>
                        </div>

                        <p className='mt-4'>Courses:</p>
                        <div className='flex flex-row flex-wrap gap-2'>
                          {selectedCourse.map((i) => (
                            <div
                              key={i.id}
                              className='relative flex w-24 flex-col rounded border'
                            >
                              <Image
                                src={i.image}
                                width={80}
                                height={80}
                                className='aspect-square w-24'
                              />

                              <p className='min-w-full text-center text-xs'>
                                {i.name}
                              </p>
                              <div
                                className='absolute right-0 top-0 cursor-pointer rounded-full bg-red-300 p-1'
                                onClick={() =>
                                  setSelectedCourse((s) =>
                                    s.filter((k) => k.id !== i.id)
                                  )
                                }
                              >
                                <AiOutlineClose size={15} />
                              </div>
                            </div>
                          ))}

                          <CourseSelector
                            onSelect={(s) =>
                              setSelectedCourse((i) => [...i, ...s])
                            }
                          >
                            <div className='relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded border bg-gray-300'>
                              <AiOutlinePlus />
                            </div>
                          </CourseSelector>
                        </div>
                      </>
                    )}

                    <Select
                      name='type'
                      label='Type'
                      className='my-2'
                      defaultSelectedKeys={
                        values.type ? [values.type] : undefined
                      }
                      errorMessage={errors.type}
                      onChange={handleChange}
                    >
                      {types.map((type) => (
                        <SelectItem key={type.key} value={type.key}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label={constants.label_course_level}
                      name='level'
                      defaultSelectedKeys={
                        values.level ? [values.level] : undefined
                      }
                      className='my-2'
                      errorMessage={errors.level}
                      onChange={handleChange}
                    >
                      {config.levels.map((lv) => (
                        <SelectItem key={lv.id} value={lv.id}>
                          {lv.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <RadioGroup
                      className='mt-6'
                      name='status'
                      value={values.status}
                      onChange={handleChange}
                    >
                      <Radio value='active'>Active</Radio>
                      <Radio value='inactive'>Inactive</Radio>
                    </RadioGroup>
                  </div>
                  <div className='ml-2 flex flex-1 flex-col'>
                    <p>
                      Image:{' '}
                      {errors.image && (
                        <span className='text-sm text-red-500'>
                          Image required
                        </span>
                      )}
                    </p>
                    <ImagePickerCrop
                      onChange={({ blobUrl }) =>
                        setFieldValue('image', blobUrl)
                      }
                    >
                      {!!values.image && (
                        <img
                          src={values.image}
                          className='aspect-square w-full border-1'
                        />
                      )}
                    </ImagePickerCrop>
                  </div>
                </div>

                <Button
                  type='submit'
                  color='primary'
                  className='mt-6 w-max'
                  isLoading={update.isLoading || create.isLoading}
                  isDisabled={
                    !values.name ||
                    (!id && selected.length == 0 && selectedCourse.length === 0)
                  }
                  onClick={handleSubmit}
                >
                  {!id ? 'Create' : 'Update'}
                </Button>
              </div>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  )
}

export default GameEdit
