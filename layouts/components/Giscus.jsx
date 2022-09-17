import 'giscus'
import { useDarkMode } from 'lib/use-dark-mode'

const GiscusComponent = ({ className = undefined }) => {
  const { isDarkMode } = useDarkMode()

  return (
    <section className={className ?? ''}>
      <giscus-widget
        repo='Jkker/blog'
        repoid='R_kgDOH79Ujw'
        category='Replies'
        categoryid='DIC_kwDOH79Uj84CROkR'
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
