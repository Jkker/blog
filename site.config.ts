import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)

  // Blog
  rootNotionPageId: 'eae99f65470b415b913f482060e43381',
  postsCollectionId: '046e539cfcd04dad8704d00994d66bed',
  // Test Suite
  // rootNotionPageId: '067dd719a912471ea9a3ac10710e7fdf',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Anti-Involutionist',
  domain: 'blog.jerrykjia.com',
  author: 'Jerry K Jia',
  yearStarted: 2022,

  // open graph metadata (optional)
  description: 'Striving to escape the vortex of involution',

  // social usernames (optional)
  // twitter: '_Jkker_',
  github: 'Jkker',
  linkedin: 'jerrykjia',
  email: 'me@jerrykjia.com',
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  pageUrlOverrides: {
    '/acknowledgement-legal-information': 'ec61b821a2e74cb893df121f16cf8268',
    '/about': '6ce65fc4d4be42e8b613cb8e6558c4cf',
  },
  // pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'About',
      pageId: '6ce65fc4d4be42e8b613cb8e6558c4cf',
    },
  ],
  i18n: {
    'en-US': {
      dateFormat: 'MMM D, YYYY',
    },
    'zh-CN': {
      dateFormat: 'YYYY年M月D日',
    }
  },
})
