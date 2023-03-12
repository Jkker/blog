import Fade from '@/components/Fade'
import { InfoCard } from '@/layouts/components/InfoCard'
import useGlobal from '@/utils/useGlobal'
import { useMinWidth } from '@/utils/useMediaQuery'
import cs from 'clsx'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import type { TableOfContentsEntry } from 'notion-utils'
import React, { useEffect, useRef, useState } from 'react'
import { RiListCheck } from 'react-icons/ri'

export const TableOfContent: React.FC<{
  tableOfContent: Array<TableOfContentsEntry>
  className?: string
  mobile?: boolean
}> = ({ tableOfContent }) => {
  const { isMobileTocVisible } = useGlobal()
  const isDesktop = useMinWidth('lg')

  const [activeSection, setActiveSection] = useState(null)
  const [percent, changePercent] = useState(0)
  const tocRef = useRef<HTMLDivElement>(null)

  const throttleMs = 25
  const debounceMs = 500

  const adjustTocScroll = debounce(
    () => {
      if (!tocRef.current) return
      const activeElement = document.querySelector(
        `.notion-table-of-contents-active-item`
      ) as HTMLElement
      // if activeElement is not in view, scroll to it
      if (!activeElement) return
      const tocRect = tocRef.current.getBoundingClientRect()
      const activeRect = activeElement.getBoundingClientRect()
      if (activeRect.top < tocRect.top || activeRect.bottom > tocRect.bottom) {
        tocRef.current.scrollTo({
          top: activeElement.offsetTop - tocRect.height / 2 - activeRect.height,
          behavior: 'smooth',
        })
      }
    },
    debounceMs,
    { leading: false, trailing: true }
  )

  useEffect(() => {
    const actionSectionScrollSpy = throttle((event = {}) => {
      if (event.isTrusted && event.eventPhase === 0) return
      const target =
        typeof window !== 'undefined' &&
        document.getElementById('main-container')
      if (!target) return

      // Update progress bar
      const clientHeight = target.clientHeight
      const scrollY = window.pageYOffset
      const fullHeight = clientHeight - window.outerHeight
      let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))
      if (per > 100) per = 100
      if (per < 0) per = 0
      changePercent(per)

      // Update active section in toc
      const sections = document.getElementsByClassName('notion-h')
      if (!sections || !sections.length) return

      let minDist = 1000
      let minDistSectionIdx = null
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const bbox = section.getBoundingClientRect()
        const absDist = Math.abs(bbox.top)
        if (absDist < minDist && bbox.top > 0) {
          minDist = absDist
          minDistSectionIdx = i
        }
      }
      if (minDistSectionIdx === null) return

      setActiveSection(sections[minDistSectionIdx].getAttribute('data-id'))
      adjustTocScroll()
    }, throttleMs)
    document.addEventListener('scroll', actionSectionScrollSpy)

    actionSectionScrollSpy()

    return () => {
      document.removeEventListener('scroll', actionSectionScrollSpy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={cs(
        'fixed lg:sticky z-20 flex-0 flex flex-col-reverse self-start gap-4',
        'right-10 bottom-24 lg:bottom-0 lg:top-5 lg:right-0'
      )}
    >
      <InfoCard className='hidden lg:block' />
      <Fade show={isDesktop || isMobileTocVisible}>
        <div
          className={cs(
            'text-gray-900 dark:text-gray-100 space-y-2',
            'right-10 ',
            'p-4 overflow-hidden',
            'acrylic bg-white/70 dark:bg-gray-700/80 shadow-md rounded-md lg:bg-white lg:dark:bg-gray-800'
            // isMobileTocVisible ? 'p-4' : 'mobile-hidden'
          )}
          style={{
            maxWidth: 'calc( 100vw - 4rem)',
          }}
          id='tableOfContent'
        >
          <h3 className='uppercase text-black dark:text-white text-lg whitespace-nowrap my-1 font-light flex items-center gap-1'>
            <RiListCheck />
            Table of Content
          </h3>
          <div className='h-4 w-full shadow-2xl bg-gray-400/90 dark:bg-gray-600 font-sans rounded-md'>
            <div
              className='h-4 bg-primary-400 duration-100 rounded-md'
              style={{ width: `${percent}%` }}
            >
              <div className='text-right text-white text-xs px-0.5'>
                {percent}%
              </div>
            </div>
          </div>
          <nav
            className='max-h-[400px] overflow-y-auto scrollbar-thin'
            ref={tocRef}
          >
            {tableOfContent.map(({ id, indentLevel, text }) => (
              <a
                key={id}
                href={`#${id}`}
                className={cs(
                  'notion-table-of-contents-item',
                  `notion-table-of-contents-item-indent-level-${indentLevel}`,
                  activeSection === id && 'notion-table-of-contents-active-item'
                )}
                id={`toc-${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(id)
                  if (!element) return
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                  })
                }}
              >
                <span
                  className='notion-table-of-contents-item-body'
                  style={{
                    display: 'inline-block',
                    marginLeft: indentLevel * 16,
                  }}
                >
                  {text}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </Fade>
    </div>
  )
}
