import defaultCoverImage from '@/data/defaultCoverImage'
import { Layout, NotionPage } from '@/layouts'
import getIcon from '@/lib/get-icon'
import * as config from '@/lib/config'
import { domain, isDev } from '@/lib/config'
import { getSiteMap } from 'lib/get-site-map'
import { mapImageUrl } from 'lib/map-image-url'
import { getCanonicalPageUrl, mapPageUrl } from 'lib/map-page-url'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { PageBlock, PageProps, Params } from 'lib/types'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import {
  getBlockTitle,
  getPageBreadcrumbs,
  getPageProperty,
  getPageTableOfContents,
  normalizeUrl,
  parsePageId,
  uuidToId,
} from 'notion-utils'
import { useEffect } from 'react'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params.pageId as string

  try {
    const { site, recordMap, pageId, error } = await resolveNotionPage(
      domain,
      rawPageId
    )

    const canonicalPageUrl =
      !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)

    const keys = Object.keys(recordMap?.block || {})
    const block = recordMap?.block?.[keys[0]]?.value
    if (!block) {
      console.error('no block', rawPageId)
    }

    const socialImage = mapImageUrl(
      getPageProperty<string>('Social Image', block, recordMap) ||
        block?.format?.page_cover ||
        config.defaultPageCover,
      block
    )

    const description = getPageProperty<string>('Description', block, recordMap)
    const noBg = getPageProperty<string>('noBg', block, recordMap)
    const tableOfContent = getPageTableOfContents(
      block as PageBlock,
      recordMap
    ).map(({ id, text, indentLevel }) => ({
      id: uuidToId(id),
      text,
      indentLevel,
    }))
    const title = getBlockTitle(block, recordMap) || site.name

    const breadcrumbs = getPageBreadcrumbs(recordMap, pageId)
      .filter(
        ({ pageId }) => !(pageId === parsePageId(config.rootNotionPageId))
      )
      .map(({ title = '', icon, active, pageId }) => ({
        title,
        icon: getIcon(icon, block),
        active,
        url: mapPageUrl(site, recordMap)(pageId),
        pageId,
      }))

    const coverImageSrc = mapImageUrl(block?.format?.page_cover, block)
    const coverImage = coverImageSrc
      ? {
          src: coverImageSrc,
          ...(recordMap?.preview_images?.[coverImageSrc] ??
            recordMap?.preview_images?.[normalizeUrl(coverImageSrc)]),
        }
      : defaultCoverImage
    const tags =
      getPageProperty<string[]>('Tags', block, recordMap)?.filter?.(
        (t) => t && t.length > 0
      ) ?? []

    const date =
      getPageProperty<number>('Published', block, recordMap) ??
      block.created_time ??
      new Date().getTime()
    const is404 = error || !site || !block

    return {
      props: {
        title,
        description,
        canonicalPageUrl,
        socialImage,
        tableOfContent,
        keys,
        recordMap,
        site,
        breadcrumbs,
        is404,
        coverImage,
        tags,
        date,
        noBg,
      },
      revalidate: 10,
    }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true,
    }
  }

  console.log('getStaticPaths')
  const siteMap = await getSiteMap()
  console.log('siteMap', siteMap)

  const staticPaths = {
    paths: Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
      params: {
        pageId,
      },
    })),
    // paths: [],
    fallback: true,
  }

  return staticPaths
}

export default function NotionDomainDynamicPage(props) {
  const router = useRouter()
  useEffect(() => {
    if (router.isReady) {
      const { r } = router.query
      if (r) {
        window.location.href = `/api/revalidate?path=${window.location.pathname}&secret=${r}`
      }
    }
  }, [router.isReady, router.query])

  // console.log('NotionDomainDynamicPage', props)
  return (
    <Layout
      breadcrumbs={props.breadcrumbs}
      coverImage={props.coverImage}
      title={props.title}
      date={props.date}
      tags={props.tags}
      site={props.site}
      description={props.description}
      socialImage={props.socialImage}
      url={props.canonicalPageUrl}
      hasToc
      hasComment
    >
      <NotionPage {...props} />
    </Layout>
  )
}
