import { createContext, useContext, useState } from 'react'
import type { ModalProps } from '@/components/Modal'
import dynamic from 'next/dynamic'

const Modal = dynamic(() => import('@/components/Modal'))

interface ModalContext {
  openModal: (props: Partial<ModalProps>) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContext>({} as ModalContext)

const defaultProps = {
  title: '',
  content: null,
  titleProps: {} as ModalProps['titleProps'],
  isOpen: false,
  icon: null,
}

export const ModalProvider = ({ children: providerChildren }) => {
  const [modal, setModal] = useState<Partial<ModalProps>>(defaultProps)
  const { title, content, titleProps, isOpen, onClose, icon } = modal

  const openModal = (props: Partial<ModalProps>) => {
    setModal({
      ...defaultProps,
      ...props,
      isOpen: true,
    })
  }
  const closeModal = () => {
    setModal(defaultProps)
    if (onClose) onClose()
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {providerChildren}
      <Modal
        title={title}
        titleProps={titleProps}
        isOpen={isOpen}
        onClose={closeModal}
        content={content}
        icon={icon}
      />
    </ModalContext.Provider>
  )
}

function useModal() {
  const { openModal, closeModal } = useContext(ModalContext)
  return { openModal, closeModal }
}

export default useModal
