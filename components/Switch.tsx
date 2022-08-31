import { Switch as HeadlessSwitch } from '@headlessui/react'
import { forwardRef } from 'react'
import cx from 'clsx'
import LoadingIcon from './LoadingIcon'

function Switch(
  {
    checked,
    onChange,
    className = '',
    children,
    icon = null,
    title = '',
    loading = false,
    disabled = false,
    ...props
  },
  ref
) {
  return (
    <HeadlessSwitch.Group
      as='div'
      className={cx(
        'text-black dark:text-gray-50 flex-center flex-col gap-1',
        className,
        {
          'opacity-80': loading || disabled,
        }
      )}
      {...props}
    >
      <HeadlessSwitch.Label className={cx('text-sm flex-center gap-1')}>
        {children || title}
      </HeadlessSwitch.Label>
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        className={cx(
          'mt-1 md:mt-2 md:mb-2 relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-white focus-visible:ring-opacity-75 shadow-md hover:shadow-gray-500/30 dark:hover:shadow-gray-500/30 font-light leading-10  outline-0 focus-visible:outline-1 outline-black dark:outline-white w-12',
          checked
            ? 'acrylic bg-primary-300/60 dark:bg-primary-900/80'
            : 'bg-white/60 dark:bg-gray-600/60',
          loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'
        )}
        ref={ref}
        title={title}
        disabled={loading}
      >
        <span className='sr-only'>{title}</span>
        <span
          aria-hidden='true'
          className={`${
            checked
              ? 'translate-x-6 bg-primary-500 dark:bg-primary-400'
              : 'translate-x-0 bg-gray-500 dark:bg-gray-300'
          }
            pointer-events-none h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-150 ease-in-out text-gray-100 dark:text-gray-200 flex-center`}
        >
          {loading ? <LoadingIcon /> : icon}
        </span>
      </HeadlessSwitch>
    </HeadlessSwitch.Group>
  )
}
Switch.displayName = 'Switch'

export default forwardRef(Switch)
