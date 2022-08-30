import cx from 'clsx'
import React from 'react'
import { linkProps } from '@/utils/link'

const sizeMap = (isIcon) => ({
  small: cx('text-sm', isIcon ? 'p-2' : 'px-3 p-2'),
  medium: cx('text-base', isIcon ? 'p-2.5' : 'px-5 py-2.5'),
  large: cx('text-lg', isIcon ? 'p-3.5' : 'px-6 py-3.5'),
})

const bgColor = {
  primary: cx(
    'acrylic',
    'bg-primary-500', // background
    'hover:bg-primary-550 dark:hover:bg-primary-450 ', // hover
    'hover:shadow-primary-500/50', // shadow
    'active:bg-primary-600 dark:active:bg-primary-600' // active
  ),
  transparent: cx(
    'hover:bg-gray-500/10', // hover
    'active:bg-gray-500/20' // active
  ),
  default: cx(
    'acrylic',
    'bg-white/70 dark:bg-gray-700/80', // background
    'hover:bg-gray-white dark:hover:bg-gray-600/80', // hover
    'active:bg-gray-100 active:shadow-inner dark:active:bg-gray-800/80', // active
    'hover:shadow-gray-500/30 dark:hover:shadow-gray-500/30' // shadow
  ),
}
const textColor = {
  primary: 'text-white',
  transparent: 'text-current',
  default: 'text-gray-600 dark:text-gray-100',
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
}

const gapMap = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  8: 'gap-8',
}

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  {
    className?: string
    size?: 'small' | 'medium' | 'large'
    color?: 'primary' | 'transparent' | 'default'
    rounded?: boolean
    icon?: React.ReactNode
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    href?: string
    justify?: 'start' | 'center' | 'end'
    gap?: 0 | 1 | 2 | 3 | 4 | 8
  } & (
    | React.ButtonHTMLAttributes<HTMLButtonElement>
    | React.AnchorHTMLAttributes<HTMLAnchorElement>
  )
>(
  (
    {
      children,
      className = '',
      size = 'medium',
      color = 'default',
      icon = null,
      leftIcon = null,
      rightIcon = null,
      href = null,
      rounded = false,
      justify = 'center',
      gap = 2,
      ...props
    },
    ref
  ) => {
    const isIcon = icon !== null

    const classNames = cx(
      'relative flex items-center',
      'group transition-all duration-200 ease-in-out',
      'focus-visible:outline-1 outline-transparent focus-visible:outline-black focus-visible:dark:outline-white',
      color === 'transparent' || 'shadow-md active:shadow-none',
      bgColor[color],
      textColor[color],
      justifyMap[justify],
      gapMap[gap],
      { rounded: rounded },
      sizeMap(isIcon)[size],
      className
    )

    const content = (
      <>
        {icon}
        {leftIcon}
        {children}
        {rightIcon}
      </>
    )

    if (href)
      return (
        <a
          className={classNames}
          href={href}
          {...linkProps(href)}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
          {content}
        </a>
      )

    return (
      <button
        className={classNames}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
      >
        {content}
      </button>
    )
  }
)
Button.displayName = 'IconButton'

export default Button
