import { cloneElement } from 'react'
import cx from 'clsx'

export default function Rotate({ children, show, className = '', ...props }) {
  if (children.length !== 2) return null
  return (
    <span
      className={cx(
        'nc-int-icon js-nc-int-icon nc-int-icon-rotate fill-current',
        {
          'nc-int-icon-state-b': !show,
        },
        className
      )}
      {...props}
    >
      {cloneElement(children[0], {
        className: cx('nc-int-icon-a', children[0].props.className),
      })}
      {cloneElement(children[1], {
        className: cx('nc-int-icon-b', children[1].props.className),
      })}
    </span>
  )
}
