import navigationLinks from '@/data/navLinks'
import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { mergeRecordMaps } from 'notion-utils'
import pMap from 'p-map'
import { isPreviewImageSupportEnabled } from './config'
import db from './db'
import { getPreviewImageMap } from './preview-images'

class Notion extends NotionAPI {
  navigationLinkRecordMaps: ExtendedRecordMap[] = []
  navigationLinkRecordMapsFetched = false

  async getNavigationLinkPages() {
    const navigationLinkPageIds = navigationLinks
      .map((link) => link.pageId)
      .filter(Boolean)

    if (navigationLinkPageIds.length) {
      this.navigationLinkRecordMaps = await pMap(
        navigationLinkPageIds,
        async (navigationLinkPageId) =>
          super.getPage(navigationLinkPageId, {
            chunkLimit: 1,
            fetchMissingBlocks: false,
            fetchCollections: false,
            signFileUrls: false,
          }),
        {
          concurrency: 4,
        }
      )
    }
  }

  async getPage(pageId: string, options?: any) {
    console.time(`📄 getPage ${pageId}`)

    const cacheKey = `notion-page-id:${pageId}`
    const cachedPage = await db.get(cacheKey)
    if (cachedPage) {
      console.timeEnd(`📄 getPage ${pageId}`)
      return cachedPage
    }

    if (!this.navigationLinkRecordMapsFetched) {
      await this.getNavigationLinkPages()
      this.navigationLinkRecordMapsFetched = true
    }

    let recordMap = await super.getPage(pageId, options)

    // const navigationLinkRecordMaps = await this.getNavigationLinkPages()

    if (this.navigationLinkRecordMaps?.length) {
      recordMap = this.navigationLinkRecordMaps.reduce(
        (map, navigationLinkRecordMap) =>
          mergeRecordMaps(map, navigationLinkRecordMap),
        recordMap
      )
    }
    if (isPreviewImageSupportEnabled) {
      const previewImageMap = await getPreviewImageMap(recordMap)
      ;(recordMap as any).preview_images = previewImageMap
    }
    await db.set(cacheKey, recordMap)

    console.timeEnd(`📄 getPage ${pageId}`)
    return recordMap
  }
  async search(params: SearchParams): Promise<SearchResults> {
    return super.search(params)
  }
}

const notion = new Notion({
  apiBaseUrl: process.env.NOTION_API_BASE_URL,
})

export default notion
