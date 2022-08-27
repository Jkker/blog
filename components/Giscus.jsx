import { useEffect } from 'react'
import { useDarkMode } from 'lib/use-dark-mode'
import { useRouter } from 'next/router'
import useGlobal from '@/utils/useGlobal'

const GiscusComponent = ({ className = '' }) => {
  const { locale } = useRouter()
  const { isDarkMode } = useDarkMode()
  const { setHasComment } = useGlobal()

  useEffect(() => {
    import('giscus').then(() => setHasComment(true))
  }, [setHasComment])

  return (
    <giscus-widget
      repo='Jkker/blog'
      repoid='R_kgDOH3Dd5A'
      category='Replies'
      categoryid='DIC_kwDOH3Dd5M4CRArf'
      mapping='pathname'
      strict='0'
      reactionsenabled='1'
      emitmetadata='0'
      inputposition='bottom'
      theme={isDarkMode ? 'transparent_dark' : 'light'}
      lang={locale.includes('en') ? 'en' : locale.LOCALE}
      crossorigin='anonymous'
      className={className}
    ></giscus-widget>
  )
}

export default GiscusComponent
