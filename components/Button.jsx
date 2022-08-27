import { linkProps } from '@/utils/link'

const shadow = {
  primary: 'from-indigo-600 to-blue-500',
  default: 'bg-gray-200 dark:bg-gray-600',
}
const background = {
  primary: 'bg-blue-500',
  default: 'bg-white dark:bg-gray-600',
}

const text = {
  primary: 'text-white',
  default: 'text-gray-600 dark:text-gray-100',
}

const Button = ({
  className = '',
  children,
  href = undefined,
  color = 'default',
  leftIcon = null,
  rightIcon = null,
  ...props
}) => {
  const content = (
    <>
      {/* <span
              className={`absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br ${bg[color]}`}
            ></span>
            <span
              className={`h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 ${bg[color]}`}
            ></span> */}
      <span
        className={`absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-md bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm ${shadow[color]}`}
      ></span>
      <span
        className={`absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br ${background[color]}`}
      ></span>
      <span className={`relative flex items-center justify-center gap-2`}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </>
  )

  return href ? (
    <a
      className={`px-5 py-2.5 relative rounded group font-medium ${text[color]} inline-block text-center whitespace-nowrap`}
      href={href}
      {...linkProps(href)}
      {...props}
    >
      {content}
    </a>
  ) : (
    <button
      className={`px-5 py-2.5 relative rounded group font-medium ${text[color]} inline-block whitespace-nowrap`}
      {...props}
    >
      {content}
    </button>
  )
}

export default Button
