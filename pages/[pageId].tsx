import * as React from 'react'
import { GetStaticProps } from 'next'
import { isDev, domain } from 'lib/config'
import { getSiteMap } from 'lib/get-site-map'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { PageBlock, PageProps, Params } from 'lib/types'
import { NotionPage, Layout } from '@/layouts'
import {
  formatDate,
  getBlockTitle,
  getPageProperty,
  getPageTableOfContents,
  getPageBreadcrumbs,
} from 'notion-utils'
import { getCanonicalPageUrl, mapPageUrl } from 'lib/map-page-url'
import * as config from 'lib/config'
import { mapImageUrl } from 'lib/map-image-url'
import { isUrl } from '@/utils/link'

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
        (block as PageBlock).format?.page_cover ||
        config.defaultPageCover,
      block
    )

    const socialDescription =
      getPageProperty<string>('Description', block, recordMap) ||
      config.description

    const tableOfContent = getPageTableOfContents(block as PageBlock, recordMap)
    const title = getBlockTitle(block, recordMap) || site.name

    const breadcrumbs = getPageBreadcrumbs(recordMap, pageId).map(
      ({ title, icon, active, pageId }) => ({
        title,
        icon: isUrl(icon) ? mapImageUrl(icon, block) : icon,
        active,
        url: mapPageUrl(site, recordMap)(pageId),
      })
    )

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

  console.log(staticPaths.paths)
  return staticPaths
}

export default function NotionDomainDynamicPage(props) {
  console.log('NotionDomainDynamicPage', props)
  return (
    <Layout hasToc={true} breadcrumbs={props.breadcrumbs}>
      <NotionPage {...props} />
    </Layout>
  )
}
