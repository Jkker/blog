import { siteConfig } from '@/lib/config/site-config'

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
  defaultPageCover:
    'https://raw.githubusercontent.com/Jkker/images/master/City%201080p.png',
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
    // '/test': '067dd719a912471ea9a3ac10710e7fdf',
  },

  i18n: {
    'en-US': {
      dateFormat: 'MMM D, YYYY',
    },
    'zh-CN': {
      dateFormat: 'YYYY年M月D日',
    },
  },
  projects: [
    {
      title: 'NYU Unoccupied Space Finder',
      description: `Find a place to chill-out when you're on campus`,
      coverImage: '/images/alesia-kazantceva-VWcPlbHglYc-unsplash.jpg',
      href: '/projects/nyu-space',
    },
    {
      title: 'Brightspace File Organizer',
      description: `Organize your Brightspace files and content`,
      href: '/projects/brightspace',
      coverImage: '/images/alfons-morales-YLSwjSy7stw-unsplash.jpg',
    },
    {
      title: 'NYU Academic Calendar Subscriber',
      description: `Subscribe to NYU's Academic Calendar via Google Calendar or iCal.`,
      coverImage: '/images/nyu.jpg',
      href: '/projects/nyu-academic-calendar',
    },
    {
      title: 'Sunset Duration',
      description: `Get the precise sunset duration of your current location`,
      coverImage: '/images/sunset.png',
      href: '/api/sunset',
    },
    {
      title: 'Metasearch',
      description: `An customizable search engine aggregator`,
      coverImage: '/images/metasearch.jpg',
      href: 'https://search.jerrykjia.com/',
    },
  ],
})
