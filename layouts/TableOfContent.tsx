import cs from 'clsx'
import throttle from 'lodash.throttle'
import { TableOfContentsEntry, uuidToId } from 'notion-utils'
import * as React from 'react'
import { RiListCheck } from 'react-icons/ri'
import useGlobal from '@/utils/useGlobal'

export const TableOfContent: React.FC<{
  tableOfContent: Array<TableOfContentsEntry>
  className?: string
  mobile?: boolean
}> = ({ tableOfContent }) => {
  const { isMobileTocVisible } = useGlobal()

  const [activeSection, setActiveSection] = React.useState(null)
  const [percent, changePercent] = React.useState(0)

  const throttleMs = 100
  const actionSectionScrollSpy = React.useMemo(
    () =>
      throttle(() => {
        const target =
          typeof window !== 'undefined' &&
          document.getElementById('main-container')
        if (target) {
          const clientHeight = target.clientHeight
          const scrollY = window.pageYOffset
          const fullHeight = clientHeight - window.outerHeight
          let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))
          if (per > 100) per = 100
          if (per < 0) per = 0
          changePercent(per)
        }

        const sections = document.getElementsByClassName('notion-h')

        let prevBBox: DOMRect = null
        let currentSectionId = activeSection

        for (let i = 0; i < sections.length; ++i) {
          const section = sections[i]
          if (!section || !(section instanceof Element)) continue

          if (!currentSectionId) {
            currentSectionId = section.getAttribute('data-id')
          }

          const bbox = section.getBoundingClientRect()
          const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
          const offset = Math.max(150, prevHeight / 4)

          // GetBoundingClientRect returns values relative to the viewport
          if (bbox.top - offset < 0) {
            currentSectionId = section.getAttribute('data-id')

            prevBBox = bbox
            continue
          }

          // No need to continue loop, if last element has been detected
          break
        }

        setActiveSection(currentSectionId)
      }, throttleMs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // explicitly not taking a dependency on activeSection
      setActiveSection,
    ]
  )

  React.useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)

    actionSectionScrollSpy()

    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [actionSectionScrollSpy])

  return (
    <div
      className={cs(
        'text-gray-900 dark:text-gray-100 space-y-2',
        'fixed lg:sticky z-20 flex-0 flex flex-col self-start',
        'right-10 bottom-24 lg:bottom-0 lg:top-16 lg:right-0',
        'transition-opacity duration-200 ease-in-out',
        'p-4',
        'acrylic bg-white/70 dark:bg-gray-800/80 shadow-md rounded lg:bg-white lg:dark:bg-gray-800',
        isMobileTocVisible || 'mobile-hidden'
      )}
      id='tableOfContent'
    >
      <h3 className='uppercase text-black dark:text-white text-xl whitespace-nowrap my-1 font-light flex items-center gap-1'>
        <RiListCheck />
        Table of Content
      </h3>
      <div className='h-4 w-full shadow-2xl bg-gray-400 font-sans'>
        <div
          className='h-4 bg-primary-400 duration-200'
          style={{ width: `${percent}%` }}
        >
          <div className='text-right text-white text-xs'>{percent}%</div>
        </div>
      </div>
      <nav className='max-h-[400px] overflow-y-auto'>
        {tableOfContent.map((tocItem) => {
          const id = uuidToId(tocItem.id)

          return (
            <a
              key={id}
              href={`#${id}`}
              className={cs(
                'notion-table-of-contents-item',
                `notion-table-of-contents-item-indent-level-${tocItem.indentLevel}`,
                activeSection === id && 'notion-table-of-contents-active-item'
              )}
            >
              <span
                className='notion-table-of-contents-item-body'
                style={{
                  display: 'inline-block',
                  marginLeft: tocItem.indentLevel * 16,
                }}
              >
                {tocItem.text}
              </span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}
