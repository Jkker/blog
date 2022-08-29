import Button from '@/components/Button'
import { isUrl } from '@/utils/link'
import Image from 'next/image'
import React from 'react'
import cx from 'clsx'

function BreadCrumbs({ breadcrumbs, className = '' }) {
  const breadCrumbs = React.useMemo(() => {
    const b = breadcrumbs.slice(1, -1).map(({ icon, url, title }, index) => (
      <li className='flex items-center' key={index}>
        <Button
          href={url}
          color='transparent'
          size='small'
          rounded
          leftIcon={
            isUrl(icon) ? (
              <Image alt={title + ' icon'} src={icon} width={20} height={20} />
            ) : (
              <span>{icon}</span>
            )
          }
          className='w-full flex-nowrap whitespace-nowrap'
          justify='start'
        >
          {title}
        </Button>
      </li>
    ))
    const curr = breadcrumbs[breadcrumbs.length - 1]
    if (curr)
      b.push(
        <li
          className='whitespace-nowrap text-sm block text-gray-600/80 dark:text-gray-300/80 p-2 flex-shrink-1 overflow-hidden text-ellipsis max-w-full'
          // gap={1}
          key={breadcrumbs.length}
        >
          {isUrl(curr.icon) ? (
            <Image
              alt={curr.title + ' icon'}
              src={curr.icon}
              width={26}
              height={26}
              className='mr-1.5'
            />
          ) : curr.icon ? (
            <span className='mr-1.5'>{curr.icon}</span>
          ) : null}
          {curr.title}
        </li>
      )
    return b
  }, [breadcrumbs])
  return breadCrumbs
}

export default BreadCrumbs
