import defaultCoverImage from '@/data/defaultCoverImage'
import cx from 'clsx'
import dynamic from 'next/dynamic'
import Image from 'next/legacy/image'
import { useEffect, useState } from 'react'
import { RiCalendarLine } from 'react-icons/ri'

const ReadingTime = dynamic(() => import('./ReadingTime'))

const Tags = ({ tags, className }) => (
  <ul className={cx('flex gap-2', className)}>
    {tags?.map((tag) => (
      <li
        key={tag}
        className='px-1.5 py-0.5 acrylic text-white bg-gray-500/50 rounded-xl whitespace-nowrap'
      >
        {tag}
      </li>
    ))}
  </ul>
)

function Header({
  coverImage = defaultCoverImage,
  title,
  date,
  tags,
  description,
}: {
  coverImage?:
    | {
        src: string
        dataURIBase64?: string
        blurDataURL?: string
      }
    | string
  title?: string
  description?: string
  date?: string
  tags?: string[]
}) {
  const {
    src,
    dataURIBase64 = undefined,
    blurDataURL = undefined,
  } = typeof coverImage === 'object' ? coverImage : { src: coverImage }
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div className='w-full relative h-[280px] sm:h-[320px]'>
      <Image
        src={src}
        alt='Page cover image'
        blurDataURL={blurDataURL || dataURIBase64}
        layout='fill'
        objectFit='cover'
        priority
        style={{
          filter: `brightness(0.7)`,
        }}
      />
      <header
        className='w-full absolute h-full top-10 left-0 flex-center pb-5 md:pb-0 px-4 z-10 flex-col gap-0.5 md:gap-1'
        style={{
          height: 'calc(100% - 48px)',
        }}
      >
        <div className='flex-center gap-2 md:gap-2 flex-col max-w-[960px]'>
          <h1 className='font-bold text-3xl md:text-4xl text-white mb-1 text-left lg:text-center'>
            {title}
          </h1>
          {description && (
            <div className='text-sm md:text-base text-white mb-2 line-clamp-3 text-left lg:text-center w-full'>
              {description}
            </div>
          )}
          <div className='flex gap-2 w-full justify-between flex-wrap'>
            <Tags className='text-sm md:text-base items-center' tags={tags} />
            <ul className='flex gap-2 justify-center'>
              {date && (
                <li className='text-white flex items-center gap-1 mx-0.5'>
                  <RiCalendarLine />
                  <time>
                    {mounted ? new Date(date).toLocaleDateString() : ''}
                  </time>
                </li>
              )}
              <ReadingTime />
            </ul>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
