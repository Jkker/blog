import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import TweetEmbed from 'react-tweet-embed'

// core notion renderer
import { NotionRenderer } from 'react-notion-x'

// utils
import * as config from 'lib/config'
import { mapImageUrl } from 'lib/map-image-url'
import { mapPageUrl } from 'lib/map-page-url'
import { searchNotion } from 'lib/search-notion'
import * as types from 'lib/types'
import type { TableOfContentsEntry } from 'notion-utils'

// components
import { Loading } from './Loading'
import { Page404 } from './Page404'
import { PageHTMLHead } from './PageHTMLHead'
import { TableOfContent } from './TableOfContent'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Comment = dynamic(() => import('@/components/Giscus'), {
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
  }
> = ({
  title,
  description: socialDescription,
  canonicalPageUrl,
  socialImage,
  tableOfContent,
  recordMap,
  pageId,
  site,
  error,
}) => {
  const router = useRouter()

  const components = React.useMemo(
    () => ({
      // nextImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet,
      // propertyLastEditedTimeValue,
      // propertyTextValue,
      // propertyDateValue,
    }),
    []
  )

  const siteMapPageUrl = React.useMemo(() => {
    return mapPageUrl(site, recordMap)
  }, [site, recordMap])

  if (router.isFallback) {
    return <Loading />
  }

  if (error) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  return (
    <>
      <PageHTMLHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />
      <div className='p-4 bg-white dark:bg-gray-800 max-w-full lg:max-w-3xl w-full rounded shadow-md'>
        <NotionRenderer
          components={components}
          recordMap={recordMap}
          rootPageId={site.rootNotionPageId}
          rootDomain={site.domain}
          previewImages={!!recordMap.preview_images}
          showCollectionViewDropdown={false}
          showTableOfContents={false}
          mapPageUrl={siteMapPageUrl}
          mapImageUrl={mapImageUrl}
          searchNotion={config.isSearchEnabled ? searchNotion : null}
          className=''
        />
        <div className='p-4 bg-white dark:bg-gray-800'>
          <Comment />
        </div>
      </div>
      {tableOfContent.length > 0 && (
        <div className=''>
          <TableOfContent tableOfContent={tableOfContent} mobile />
        </div>
      )}
    </>
  )
}
