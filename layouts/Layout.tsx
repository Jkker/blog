import Toolbar from '@/components/Toolbar'
import cx from 'clsx'

import { Header } from './Header'
import { Footer } from './Footer'
import { useState } from 'react'

export function Layout({ children, hasToc, breadcrumbs }) {
  const [showNav, setShowNav] = useState(false)

  return (
    <div className={cx('flex-center flex-col gap-4 w-full')}>
      <Header
        breadcrumbs={breadcrumbs}
        showNav={showNav}
        setShowNav={setShowNav}
      />
      <div className='bg-gray-500 h-64'></div>
      <div className='flex max-w-screen-lg md:gap-4 md:m-4 w-full flex-1 justify-center'>
        {children}
      </div>
      <Footer />
      <Toolbar hasToc={hasToc} showNav={showNav} />
    </div>
  )
}
