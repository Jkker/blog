import useGlobal from '@/utils/useGlobal'
import cs from 'clsx'
import { useDarkMode } from 'lib/use-dark-mode'
import React from 'react'
import {
  RiArrowUpLine,
  RiChat3Fill,
  RiCloseFill,
  RiListCheck,
  RiMoonFill,
  RiSunFill,
} from 'react-icons/ri'
import Rotate from './Rotate'

const Button = React.forwardRef<
  HTMLButtonElement,
  {
    className?: string
    active?: boolean
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className = '', active = false, ...props }, ref) => {
  return (
    <button
      className={cs(
        'w-9 h-9 flex-center text-xl transition-all duration-200 ease-in-out box-border outline-none',
        'text-white acrylic',
        active
          ? 'bg-primary-500 dark:bg-primary-500 shadow-inner dark:shadow-inner'
          : 'bg-primary-400 dark:bg-gray-900/80',
        'hover:bg-primary-500 dark:hover:bg-primary-500 dark:focus:bg-primary-500 hover:text-white',
        'active:shadow-inner dark:active:shadow-inner active:bg-primary-600/90 dark:active:bg-primary-600/80',
        'hover:shadow-xl',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = 'Button'

const ToggleThemeButton = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  return (
    <Button onClick={onToggleTheme}>
      <Rotate show={isDarkMode}>
        <RiSunFill />
        <RiMoonFill />
      </Rotate>
    </Button>
  )
}

const ToggleToc = ({ show, setShow }) => {
  const buttonRef = React.useRef(null)

  React.useEffect(() => {
    const listener = (event) => {
      const mobileToc = document.getElementById('toc') as HTMLElement

      if (!mobileToc) return

      if (
        !document.activeElement ||
        (!mobileToc.contains(event.target) &&
          !buttonRef.current.contains(event.target))
      )
        setShow(false)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [setShow])

  return (
    <Button
      className='lg:hidden'
      onClick={() => setShow((show) => !show)}
      active={show}
      ref={buttonRef}
    >
      <Rotate show={show}>
        <RiCloseFill />
        <RiListCheck />
      </Rotate>
    </Button>
  )
}

export default function Toolbar({}) {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { hasComment, isMobileTocVisible, setIsMobileTocVisible } = useGlobal()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return (
    <div className='flex flex-col fixed right-0 bottom-24 z-50 shadow-md first:rounded-t-md first:hidden'>
      <ToggleThemeButton />
      <ToggleToc show={isMobileTocVisible} setShow={setIsMobileTocVisible} />
      {hasComment && (
        <Button
          onClick={() =>
            document.getElementsByTagName('giscus-widget')[0].scrollIntoView()
          }
        >
          <RiChat3Fill />
        </Button>
      )}
      <Button onClick={() => window.scrollTo({ top: 0 })}>
        <RiArrowUpLine />
      </Button>
    </div>
  )
}
