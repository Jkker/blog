import Button from '@/components/Button'
import Icon from '@/components/Icon'
import React from 'react'

function BreadCrumbs({ breadcrumbs, className = '' }) {
  const breadCrumbs = React.useMemo(() => {
    const b = breadcrumbs.slice(0, -1).map(({ icon, url, title }, index) => (
      <li className='flex items-center' key={index}>
        <Button
          href={url}
          color='transparent'
          size='small'
          rounded
          className='w-full flex-nowrap whitespace-nowrap'
          justify='start'
          title={title}
        >
          {title}
        </Button>
      </li>
    ))
    const curr = breadcrumbs[breadcrumbs.length - 1]
    if (curr)
      b.push(
        <li
          className='whitespace-nowrap text-sm p-2 flex-shrink-1 flex items-center sm:justify-center gap-1.5 overflow-hidden text-ellipsis max-w-full opacity-90 cursor-default'
          // gap={1}
          key={breadcrumbs.length}
          title={curr.title}
        >
          {curr.icon ? (
            <Icon icon={curr.icon} sizeCls='w-5 h-5' size={20} dark />
          ) : null}
          <span className='overflow-hidden text-ellipsis max-w-full'>
            {curr.title}
          </span>
        </li>
      )
    return b
  }, [breadcrumbs])
  return breadCrumbs
}

export default BreadCrumbs
