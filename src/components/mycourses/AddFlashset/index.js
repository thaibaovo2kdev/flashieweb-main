import { useEffect, memo, useState, useCallback } from 'react'
import {
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox,
} from '@nextui-org/react'
import { Formik } from 'formik'

const AddFlashset = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState({
    name: '',
    type: '',
  })

  const handleSubmit = () => {
    return null
  }
  const handleChange = ({ target }) => {
    console.log('target', target.name, target.checked)
  }
  return (
    <>
      <div>
        <Button
          onClick={() => {
            setIsOpen(true)
          }}
          color='primary'
        >
          Add Flash Set
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        size='xl'
        isDismissable={false}
        onOpenChange={() => {
          setIsOpen(false)
        }}
      >
        <ModalContent>
          <ModalHeader className='flex flex-row text-center'>
            List Flash Set
          </ModalHeader>
          <ModalBody>
            <div className='mt-4 flex flex-row justify-end'>
              <Button color='primary'>Submit</Button>
            </div>
            <div>
              <Formik
                onSubmit={handleSubmit}
                initialValues={state}
                enableReinitialize={true}
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
                    <div className='flex w-[100%] flex-col'>
                      <Input
                        type='text'
                        label='Search Group'
                        placeholder='Search Flash set name'
                        className='my-2 min-w-[320px]'
                        name='name'
                        errorMessage={errors.name}
                        value={values.name}
                        onChange={handleChange}
                      />
                      <Select
                        label='Type'
                        name='type'
                        defaultSelectedKeys={
                          values.type ? [values.type] : undefined
                        }
                        className='my-2'
                        onChange={handleChange}
                      >
                        <SelectItem key={'flower'} value={'flower'}>
                          Flower
                        </SelectItem>
                        <SelectItem key={'animal'} value={'animal'}>
                          Animal
                        </SelectItem>
                      </Select>
                      <div className='flex flex-row justify-end'>
                        <Button
                          type='submit'
                          color='primary'
                          className='mr-0 mt-6 w-max'
                          onClick={handleSubmit}
                        >
                          Filter
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Formik>
              <p className='mt-4 text-center text-large text-lg'>Name</p>
              <div className='flex flex-col'>
                {[1, 2, 3, 4, 5, 6].map((i, idx) => (
                  <Checkbox
                    name={i}
                    key={idx}
                    defaultSelected
                    size='md'
                    onChange={handleChange}
                  >
                    Name {i}
                  </Checkbox>
                ))}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

function areEqual(p, n) {
  return true
}

export default memo(AddFlashset, areEqual)
