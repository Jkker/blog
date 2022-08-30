import 'giscus'
import { useDarkMode } from 'lib/use-dark-mode'

const GiscusComponent = ({ className = undefined }) => {
  const { isDarkMode } = useDarkMode()

  return (
    <section className={className ?? ''}>
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
        crossorigin='anonymous'
      ></giscus-widget>
    </section>
  )
}

export default GiscusComponent
