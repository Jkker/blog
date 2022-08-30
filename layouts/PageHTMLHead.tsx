import Head from 'next/head'
import * as React from 'react'

import * as types from 'lib/types'
import * as config from 'lib/config'

export const PageHTMLHead: React.FC<
  types.PageProps & {
    title?: string
    description?: string
    socialImage?: string
    url?: string
  }
> = ({ site, title, description, socialImage, url }) => {
  const rssFeedUrl = `${config.host}/feed`

  title = title ?? site?.name
  description = description ?? site?.description

  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />

      <meta name='robots' content='index,follow' />
      <meta property='og:type' content='website' />

      {site && (
        <>
          <meta property='og:site_name' content={site.name} />
          <meta property='twitter:domain' content={site.domain} />
        </>
      )}

      {config.twitter && (
        <meta name='twitter:creator' content={`@${config.twitter}`} />
      )}

      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
          <meta name='twitter:description' content={description} />
        </>
      )}

      {socialImage ? (
        <>
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:image' content={socialImage} />
          <meta property='og:image' content={socialImage} />
        </>
      ) : (
        <meta name='twitter:card' content='summary' />
      )}

      {url && (
        <>
          <link rel='canonical' href={url} />
          <meta property='og:url' content={url} />
          <meta property='twitter:url' content={url} />
        </>
      )}

      <link
        rel='alternate'
        type='application/rss+xml'
        href={rssFeedUrl}
        title={site?.name}
      />
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css'
        integrity='sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X'
        crossOrigin='anonymous'
      />
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossOrigin='anonymous'
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href='https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap'
        rel='stylesheet'
      />
      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
      <title>
        {title} | {site?.name === title ? site?.description : site?.name}
      </title>
    </Head>
  )
}
