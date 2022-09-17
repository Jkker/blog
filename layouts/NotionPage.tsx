import cx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import TweetEmbed from 'react-tweet-embed'

// core notion renderer
import { NotionRenderer } from 'react-notion-x'

// utils
import { mapImageUrl } from 'lib/map-image-url'
import { mapPageUrl } from 'lib/map-page-url'
import * as types from 'lib/types'
import type { TableOfContentsEntry } from 'notion-utils'

// components
import Loading from '@/components/Loading'
import NextImage from 'next/image'
import { Page404 } from './Page404'
import { TableOfContent } from './TableOfContent'
// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Comment = dynamic(() => import('@/layouts/components/Giscus'), {
  ssr: false,
})

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.all([
      import('prismjs/components/prism-markup-templating.js'),
      import('prismjs/components/prism-markup.js'),
      import('prismjs/components/prism-bash.js'),
      import('prismjs/components/prism-c.js'),
      import('prismjs/components/prism-cpp.js'),
      import('prismjs/components/prism-csharp.js'),
      import('prismjs/components/prism-docker.js'),
      import('prismjs/components/prism-java.js'),
      import('prismjs/components/prism-js-templates.js'),
      import('prismjs/components/prism-coffeescript.js'),
      import('prismjs/components/prism-diff.js'),
      import('prismjs/components/prism-git.js'),
      import('prismjs/components/prism-go.js'),
      import('prismjs/components/prism-graphql.js'),
      import('prismjs/components/prism-handlebars.js'),
      import('prismjs/components/prism-less.js'),
      import('prismjs/components/prism-makefile.js'),
      import('prismjs/components/prism-markdown.js'),
      import('prismjs/components/prism-objectivec.js'),
      import('prismjs/components/prism-ocaml.js'),
      import('prismjs/components/prism-python.js'),
      import('prismjs/components/prism-reason.js'),
      import('prismjs/components/prism-rust.js'),
      import('prismjs/components/prism-sass.js'),
      import('prismjs/components/prism-scss.js'),
      import('prismjs/components/prism-solidity.js'),
      import('prismjs/components/prism-sql.js'),
      import('prismjs/components/prism-stylus.js'),
      import('prismjs/components/prism-swift.js'),
      import('prismjs/components/prism-wasm.js'),
      import('prismjs/components/prism-yaml.js'),
    ])
    return m.Code
  })
)

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false,
  }
)

const Tweet = ({ id }: { id: string }) => {
  return <TweetEmbed tweetId={id} />
}

export const NotionPage: React.FC<
  types.PageProps & {
    title: string
    description: string
    canonicalPageUrl: string
    socialImage: string
    tableOfContent: TableOfContentsEntry[]
    noBg: boolean
  }
> = ({ tableOfContent, recordMap, pageId, site, error, noBg = false }) => {
  const router = useRouter()

  const components = React.useMemo(
    () => ({
      nextImage: NextImage,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet,
    }),
    []
  )

  const siteMapPageUrl = React.useMemo(() => {
    return mapPageUrl(site, recordMap)
  }, [site, recordMap])

  if (router.isFallback) {
    return <Loading fullscreen />
  }

  if (error) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  return (
    <>
      <div className='flex flex-col lg:gap-4 max-w-[100vw] overflow-hidden lg:max-w-3xl w-full'>
        <NotionRenderer
          components={components}
          recordMap={recordMap as any}
          rootPageId={site.rootNotionPageId}
          rootDomain={site.domain}
          previewImages={!!recordMap.preview_images}
          showCollectionViewDropdown={false}
          showTableOfContents={false}
          mapPageUrl={siteMapPageUrl}
          mapImageUrl={mapImageUrl}
          defaultPageCover={`https://www.jerrykjia.com/images/city.webp`}
          // searchNotion={(config.isSearchEnabled as any) ? searchNotion : null}
          className={cx(
            noBg ||
              'lg:p-4 lg:bg-white lg:dark:bg-gray-800 rounded lg:shadow-md'
          )}
        />
        <div
          className={
            noBg
              ? 'card'
              : 'lg:p-4 lg:bg-white lg:dark:bg-gray-800 rounded lg:shadow-md'
          }
        >
          <Comment />
        </div>
      </div>
      {tableOfContent.length > 0 && (
        <TableOfContent tableOfContent={tableOfContent} mobile />
        // <div className=''></div>
      )}
    </>
  )
}
