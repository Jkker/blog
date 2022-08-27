import Toolbar from '@/components/Toolbar'
import cx from 'clsx'
import { useState } from 'react'

import dynamic from 'next/dynamic'

import { Footer } from './Footer'

export function Layout({ children }) {
  return (
    <div className={cx('flex-center flex-col gap-4 w-full')}>
      <div className='bg-gray-500 h-64'></div>
      <div className='flex max-w-screen-lg md:gap-4 md:m-4 w-full flex-1 justify-center'>
        {children}
      </div>
      <Footer />
      <Toolbar />
    </div>
  )
}
