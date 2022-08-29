import Toolbar from '@/components/Toolbar'
import cx from 'clsx'

import { useState } from 'react'
import CoverImage from './CoverImage'
import { Footer } from './Footer'
import { Header } from './Header'
import { PageHTMLHead } from './PageHTMLHead'
export function Layout({
  children,
  hasToc = false,
  breadcrumbs = [],
  coverImage,
  noPadding = false,
  title,
  date,
  tags,
  pageId,
  site,
  socialDescription,
  socialImage,
  url,
  description,
}: {
  children: React.ReactNode
  hasToc?: boolean
  breadcrumbs?: any
  coverImage?: {
    src: string
    dataURIBase64?: string
    blurDataURL?: string
  }
  noPadding?: boolean
  title?: string
  date?: string
  tags?: string[]
  pageId?: string
  site?: any
  socialDescription?: string
  socialImage?: string
  url?: string
  description?: string
}): JSX.Element {
  const [showNav, setShowNav] = useState(true)

  return (
    <div className={cx('flex-center flex-col w-full min-h-screen')}>
      <PageHTMLHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
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
      <Toolbar hasToc={hasToc} showNav={showNav} />
    </div>
  )
}
