import Toolbar from '@/components/Toolbar'
import cx from 'clsx'

import { useState } from 'react'
import CoverImage from './Header'
import { Footer } from './Footer'
import { Header } from './NavBar'
import { PageHTMLHead } from './PageHTMLHead'

export function Layout({
  children,

  site,
  breadcrumbs = [],

  title,
  description,
  tags,
  date,
  url,

  socialImage,
  coverImage,

  noPadding = false,
  hasToc = false,
  hasComment = false,
}: {
  children: React.ReactNode

  site?: any
  breadcrumbs?: any

  title?: string
  description?: string
  tags?: string[]
  date?: string
  url?: string
  socialImage?: string

  coverImage?: {
    src: string
    dataURIBase64?: string
    blurDataURL?: string
  }

  noPadding?: boolean
  hasComment?: boolean
  hasToc?: boolean
}): JSX.Element {
  const [showNav, setShowNav] = useState(true)

  return (
    <div className={cx('flex-center flex-col w-full min-h-screen')}>
      <PageHTMLHead
        site={site}
        title={title}
        description={description}
        socialImage={socialImage}
        url={url}
      />
      <Header
        breadcrumbs={breadcrumbs}
        showNav={showNav}
        setShowNav={setShowNav}
      />

      <CoverImage
        coverImage={coverImage}
        title={title}
        description={description}
        date={date}
        tags={tags}
      />
      {/* <div className='bg-gray-500 h-64'></div> */}
      <div
        className={cx(
          'flex max-w-screen-lg lg:gap-4 -mt-5 relative lg:m-4 w-full flex-1 justify-center bg-gray-50 dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent rounded-2xl lg:rounded shadow-top lg:shadow-none',
          {
            'p-4': !noPadding,
          }
        )}
        id='main-container'
      >
        {children}
      </div>
      <Footer />
      <Toolbar hasToc={hasToc} showNav={showNav} hasComment={hasComment} />
    </div>
  )
}
