import { Transition } from '@headlessui/react'

export default function Fade({ show = false, children }) {
  return (
    <Transition
      enter='transition-opacity ease-in-out duration-75'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='transition-opacity ease-in-out duration-300'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
      show={!!show}
    >
      {children}
    </Transition>
  )
}
