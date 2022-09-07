import Button from '@/components/Button'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { RiCloseFill } from 'react-icons/ri'

export interface ModalProps {
  isOpen: boolean
  title: React.ReactNode
  icon?: React.ReactNode
  content: React.ReactNode
  onClose?: () => void
  titleProps?: React.PropsWithChildren<typeof Dialog.Title>
  closeAble?: boolean
}

export default function MyModal({
  isOpen,
  title,
  content,
  titleProps,
  onClose = () => {},
  icon = null,
  closeAble = true,
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div
            className='fixed inset-0 bg-black bg-opacity-25 acrylic'
            // onClick={() => {
            //   if (closeAble) onClose()
            // }}
          />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-3xl transition-all text-gray-700 dark:text-gray-400 flex flex-col gap-4 relative'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900 dark:text-white pr-6 w-full flex items-center space-x-2'
                  {...titleProps}
                >
                  {icon}
                  <span className='text-lg w-full text-ellipsis whitespace-nowrap overflow-hidden'>
                    {title}
                  </span>
                </Dialog.Title>
                <Button
                  icon={<RiCloseFill />}
                  onClick={onClose}
                  rounded
                  color='transparent'
                  title='Close Modal'
                  className='top-4 right-4'
                  position='absolute'
                />
                {content}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
