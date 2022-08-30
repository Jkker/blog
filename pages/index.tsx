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
import defaultCoverImage from '@/data/defaultCoverImage'

export const getStaticProps = async () => {
  try {
    const props = (await resolveNotionPage(domain)) as PageProps & {
      postList: any[]
      tagSchema: any
    }
    if (props.error) {
      throw props.error
    }
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
        const tags = getPageProperty<string[]>(
          'Tags',
          block,
          recordMap
        )?.filter?.((t) => t && t.length > 0)
        const date =
          getPageProperty<number>('Published', block, recordMap) ??
          block.created_time
        const coverImageSrc = mapImageUrl(block?.format?.page_cover, block)

        const coverImage = coverImageSrc
          ? {
              src: coverImageSrc,
              ...(recordMap?.preview_images?.[coverImageSrc] ??
                recordMap?.preview_images?.[normalizeUrl(coverImageSrc)]),
            }
          : defaultCoverImage

        return {
          id,
          collectionId,
          title,
          coverImage,
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
    console.log(
      `🚀 ~ file: index.tsx ~ line 93 ~ getStaticProps ~ props`,
      props
    )

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainPage(props) {
  console.log(
    `🚀 ~ file: index.tsx ~ line 105 ~ NotionDomainPage ~ props`,
    props
  )
  // return '123'

  return (
    <Layout
      {...props}
      title={props.site.name}
      description={props.site.description}
    >
      <div className='space-y-4 lg:space-y-8 container'>
        {props.postList.map((post) => (
          <BlogPostCard key={post.id} {...post} />
        ))}
      </div>
    </Layout>
  )
}
