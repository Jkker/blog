import { useDarkMode } from '@/lib/use-dark-mode'
import { isUrl } from '@/utils/link'
import clsx from 'clsx'
import Image from 'next/legacy/image'

const Icon = ({ icon, size = 20, sizeCls = 'w-5 h-5', dark = undefined }) => {
  const { isDarkMode } = useDarkMode()

  if (icon.startsWith('/icons'))
    return (
      <Image
        src={
          dark || isDarkMode
            ? `https://www.notion.so${icon}?mode=dark`
            : `https://www.notion.so${icon}`
        }
        width={size}
        height={size}
        alt={icon}
        className={sizeCls}
      />
    )
  if (isUrl(icon)) {
    return (
      <Image
        alt={icon}
        src={icon}
        width={size}
        height={size}
        className={sizeCls}
      />
    )
  }
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: icon,
      }}
      className={clsx('flex-center -ml-1', sizeCls)}
    />
  )
}

export default Icon
