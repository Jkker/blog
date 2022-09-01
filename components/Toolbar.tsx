import useGlobal from '@/utils/useGlobal'
import { useRef, useEffect, useState, useCallback } from 'react'
import {
  RiArrowUpLine,
  RiChat2Line,
  RiCloseFill,
  RiListCheck,
} from 'react-icons/ri'
import Button from './Button'
import Rotate from './Rotate'
import ToggleThemeButton from './ToggleThemeButton'
import useClickOutside from '@/utils/useClickOutside'
import cx from 'clsx'

const ToggleToc = ({ show, setShow }) => {
  const buttonRef = useRef(null)

  const handler = useCallback(
    (event) => {
      const mobileToc = document.getElementById('tableOfContent') as HTMLElement
      if (!mobileToc) return
      if (
        !document.activeElement ||
        (!mobileToc.contains(event.target) &&
          !buttonRef.current.contains(event.target))
      )
        setShow(false)
    },
    [setShow]
  )

  useClickOutside(buttonRef, handler, true)

  return (
    <Button
      className='lg:hidden'
      onClick={() => setShow((show) => !show)}
      ref={buttonRef}
      title={show ? 'Hide table of content' : 'Show table of content'}
      icon={
        <Rotate show={show}>
          <RiCloseFill />
          <RiListCheck />
        </Rotate>
      }
    ></Button>
  )
}

export default function Toolbar({
  hasToc = false,
  hasComment = false,
  showNav,
}) {
  const [hasMounted, setHasMounted] = useState(false)
  const { isMobileTocVisible, setIsMobileTocVisible } = useGlobal()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return (
    <div
      className={cx(
        'flex text-inherit flex-col fixed bottom-24 z-30 shadow-md transition-all duration-150',
        // showNav ? '-right-20' :
        'right-0'
      )}
    >
      <ToggleThemeButton />
      {hasToc && (
        <ToggleToc show={isMobileTocVisible} setShow={setIsMobileTocVisible} />
      )}
      {hasComment && (
        <Button
          onClick={() =>
            document.getElementsByTagName('giscus-widget')[0].scrollIntoView()
          }
          icon={<RiChat2Line />}
          title='Go to comments'
        ></Button>
      )}
      <Button
        title='Go to top'
        onClick={() => window.scrollTo({ top: 0 })}
        icon={<RiArrowUpLine />}
      ></Button>
    </div>
  )
}
