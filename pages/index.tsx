import BlogPostCard from '@/components/BlogPostCard'
import { Layout } from '@/layouts'
import dayjs from '@/lib/dayjs'
import { getCanonicalPageId } from '@/lib/get-canonical-page-id'
import { PageProps } from '@/lib/types'
import config from '@/site.config'
import { domain } from 'lib/config'
import { mapImageUrl } from 'lib/map-image-url'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { useRouter } from 'next/router'
import {
  getBlockTitle,
  getPageProperty,
  normalizeUrl,
  parsePageId,
} from 'notion-utils'

export const getStaticProps = async () => {
  try {
    const props = (await resolveNotionPage(domain)) as PageProps & {
      postList: any[]
      tagSchema: any
    }
    if (props.error) {
      throw props.error
    }
    const rootBlock = props.recordMap.block[parsePageId(props.pageId)] ?? {}
    const collectionId = parsePageId(config.postsCollectionId)
    const recordMap = props.recordMap
    const getUrl = (pageId) =>
      getCanonicalPageId(parsePageId(pageId, { uuid: true }), recordMap, {
        uuid: process.env.NODE_ENV && process.env.NODE_ENV === 'development',
      })

    const schema = recordMap.collection?.[collectionId]?.value?.schema
    const tagSchemaOptions = Object.values(schema).find(
      (x) => x.name === 'Tags'
    ).options
    const tagColorMap = Object.fromEntries(
      tagSchemaOptions.map((x) => [x.value, x.color])
    )

    const postList = Object.entries(props.recordMap.block)
      .map(([id, { value: block }]) => {
        if (parsePageId(block.parent_id) !== collectionId) return false
        const isPublic = getPageProperty<boolean>('Public', block, recordMap)
        if (!isPublic) return false

        const title = getBlockTitle(block, props.recordMap)

        const description = getPageProperty<string>(
          'Description',
          block,
          recordMap
        )
        const tags = getPageProperty<string[]>('Tags', block, recordMap).filter(
          (t) => t && t.length > 0
        )
        const date =
          getPageProperty<number>('Published', block, recordMap) ??
          block.created_time
        const src = mapImageUrl(block.format?.page_cover, block)
        const previewImage =
          recordMap?.preview_images?.[src] ??
          recordMap?.preview_images?.[normalizeUrl(src)]

        return {
          id,
          collectionId,
          title,
          image: src,
          previewImage,
          tags: tags.map((t) => ({
            name: t,
            color: tagColorMap[t],
          })),
          date,
          block,
          description,
          url: getUrl(id),
        }
      })
      .filter(Boolean)

    props.postList = postList

    return { props: { rootBlock, ...props }, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainPage(props) {
  console.log(`🚀 props`, props)
  const { locale } = useRouter()

  const date = dayjs(props.date).format(
    config.i18n[locale].dateFormat ?? 'YYYY-MM-DD'
  )

  return (
    <Layout {...props}>
      <div className='space-y-4 p-4'>
        {props.postList.map((post) => (
          <BlogPostCard key={post.id} {...post} date={date} />
        ))}
      </div>
    </Layout>
  )
}
