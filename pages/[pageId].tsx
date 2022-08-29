import defaultCoverImage from '@/data/defaultCoverImage'
import { Layout, NotionPage } from '@/layouts'
import { isUrl } from '@/utils/link'
import * as config from 'lib/config'
import { domain, isDev } from 'lib/config'
import { getSiteMap } from 'lib/get-site-map'
import { mapImageUrl } from 'lib/map-image-url'
import { getCanonicalPageUrl, mapPageUrl } from 'lib/map-page-url'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { PageBlock, PageProps, Params } from 'lib/types'
import { GetStaticProps } from 'next'
import {
  getBlockTitle,
  getPageBreadcrumbs,
  getPageProperty,
  getPageTableOfContents,
  normalizeUrl,
  parsePageId,
} from 'notion-utils'

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

    const socialImage = mapImageUrl(
      getPageProperty<string>('Social Image', block, recordMap) ||
        block.format?.page_cover ||
        config.defaultPageCover,
      block
    )

    const socialDescription =
      getPageProperty<string>('Description', block, recordMap) ||
      config.description

    const tableOfContent = getPageTableOfContents(block as PageBlock, recordMap)
    const title = getBlockTitle(block, recordMap) || site.name

    const breadcrumbs = getPageBreadcrumbs(recordMap, pageId)
      .filter(
        ({ pageId }) => !(pageId === parsePageId(config.rootNotionPageId))
      )
      .map(({ title, icon, active, pageId }) => ({
        title,
        icon: isUrl(icon) ? mapImageUrl(icon, block) : icon,
        active,
        url: mapPageUrl(site, recordMap)(pageId),
        pageId,
      }))

    const coverImageSrc = mapImageUrl(block.format?.page_cover, block)
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
        description: socialDescription,
        canonicalPageUrl,
        socialImage,
        tableOfContent,
        keys,
        recordMap,
        pageId,
        site,
        breadcrumbs,
        is404,
        coverImage,
        tags,
        date,
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

  const siteMap = await getSiteMap()

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
  // console.log('NotionDomainDynamicPage', props)
  return (
    <Layout
      hasToc={true}
      breadcrumbs={props.breadcrumbs}
      coverImage={props.coverImage}
      title={props.title}
      date={props.date}
      tags={props.tags}
      pageId={props.pageId}
      site={props.site}
      description={props.socialDescription}
      socialImage={props.socialImage}
      url={props.canonicalPageUrl}
    >
      <NotionPage {...props} />
    </Layout>
  )
}
