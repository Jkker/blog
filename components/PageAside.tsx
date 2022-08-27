import { Block, ExtendedRecordMap } from 'notion-types'
import * as React from 'react'

import { PageActions } from './PageActions'
import { PageSocial } from './PageSocial'

export const PageAside: React.FC<{
  block: Block
  recordMap: ExtendedRecordMap
  isBlogPost: boolean
}> = ({ block, recordMap, isBlogPost }) => {
  if (!block) {
    return null
  }

  // only display comments and page actions on blog post pages
  if (isBlogPost) {
    return <PageActions />
  }

  return <PageSocial />
}
