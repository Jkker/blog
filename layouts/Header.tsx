import Button from '@/components/Button'
import Collapse from '@/components/Collapse'
import Link from '@/components/Link'
import Rotate from '@/components/Rotate'
import ToggleThemeButton from '@/components/ToggleThemeButton'
import navigationLinks from '@/data/navLinks'
import Avatar from '@/public/avatar.jpg'
import useClickOutside from '@/utils/useClickOutside'
import useScroll from '@/utils/useScroll'
import cx from 'clsx'
import throttle from 'lodash.throttle'
import Image from 'next/image'
import * as React from 'react'
import { RiCloseFill, RiMenuFill } from 'react-icons/ri'
import type { BreadCrumb } from '@/utils/useGlobal'
import { isUrl } from '@/utils/link'
import BreadCrumbs from '@/components/BreadCrumbs'
let windowTop = 0

const AvatarIcon = ({ className = '' }) => (
  <Button
    href='/'
    color='transparent'
    size='small'
    rounded
    className={className}
    leftIcon={
      <Image
        src={Avatar}
        alt='avatar'
        height={24}
        width={24}
        className='rounded-full '
      />
    }
  >
    Blog
  </Button>
)

export const Header = ({ breadcrumbs = [], showNav, setShowNav }) => {
  const navRef = React.useRef()

  const [transparent, setTransparent] = React.useState(false)
  const [showMenu, setShowMenu] = React.useState(false)

  const closeMenu = () => setShowMenu(false)

  useClickOutside(navRef, closeMenu)
  // 监听滚动
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollTrigger = React.useCallback(
    throttle(() => {
      const scrollS = window.scrollY
      const header = document.querySelector('#header')
      const showNav =
        scrollS <= windowTop ||
        scrollS < 5 ||
        (header && scrollS <= header.clientHeight) // 非首页无大图时影藏顶部 滚动条置顶时隐藏
      const navTransparent =
        scrollS < document.documentElement.clientHeight - 12 || scrollS < 300 // 透明导航条的条件

      setTransparent(header && navTransparent)
      setShowNav(showNav)
      if (!showNav) closeMenu()
      windowTop = scrollS
    }, 100),
    []
  )
  // scrollTrigger()
  useScroll(scrollTrigger, [])

  const links = React.useMemo(
    () =>
      navigationLinks
        ?.map(({ icon, url, title }, index) => (
          <Button
            href={url}
            key={index}
            color='transparent'
            size='small'
            rounded
            leftIcon={icon}
            className='w-full space-x-4'
            justify='start'
            // gap={3}
          >
            {title}
          </Button>
        ))
        .filter(Boolean),
    []
  )

  return (
    <>
      <header
        className={cx(
          'fixed top-0 left-0 w-full z-30 transform duration-200',
          showMenu ? 'rounded-b-lg shadow-xl' : 'shadow-md',
          transparent
            ? 'text-white bg-none shadow-none bg-transparent'
            : 'text-black dark:text-gray-50 bg-white/60 dark:bg-gray-800/70 acrylic shadow-md',
          showNav ? 'top-0' : '-top-20'
        )}
        onDoubleClick={() => window.scrollTo(0, 0)}
        ref={navRef}
      >
        <nav className='flex items-center justify-between px-2 py-1 lg:px-8'>
          <ul className='items-center divide-spacer list-none hidden sm:flex'>
            <li className='flex items-center flex-shrink-0'>
              <AvatarIcon />
            </li>
            <BreadCrumbs breadcrumbs={breadcrumbs} />
          </ul>
          <AvatarIcon className='flex sm:hidden' />
          <div className='flex gap-1 items-center justify-end'>
            <div className='gap-1 items-center hidden sm:flex'>{links}</div>
            <ToggleThemeButton color='transparent' rounded />
            {/* <Search block={block} title={null} /> */}
            <Button
              onClick={() => setShowMenu((s) => !s)}
              className='flex sm:hidden'
              color='transparent'
              rounded
              icon={
                <Rotate show={showMenu}>
                  <RiCloseFill />
                  <RiMenuFill />
                </Rotate>
              }
            />
          </div>
        </nav>
        <Collapse
          type='vertical'
          isOpen={showMenu}
          className='sm:hidden shadow-lg dark:shadow-lg z-20 self-start  w-full'
        >
          <div className='px-2 pb-2 text-black dark:text-gray-200 shadow-md rounded-b'>
            <BreadCrumbs breadcrumbs={breadcrumbs} />

            {links}
          </div>
        </Collapse>
      </header>
    </>
  )
}
