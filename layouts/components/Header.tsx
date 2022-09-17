import React from 'react'
import Image from 'next/image'
import defaultCoverImage from '@/data/defaultCoverImage'
import TagItemMini, { Tag } from '@/components/TagItemMini'
import { RiTimeLine } from 'react-icons/ri'
import cx from 'clsx'

const Tags = ({ tags, className }) => (
  <ul className={cx('flex gap-2', className)}>
    {tags?.map((tag) => (
      <li
        key={tag}
        className='px-1.5 py-0.5 acrylic text-white bg-gray-300/30 dark:bg-gray-700/30 rounded-xl'
      >
        {tag}
      </li>
    ))}
  </ul>
)

function CoverImage({
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

  return (
    <div className='w-full relative h-[280px] sm:h-[320px]'>
      <Image
        src={src}
        alt='Page cover image'
        blurDataURL={blurDataURL || dataURIBase64}
        layout='fill'
        objectFit='cover'
        priority
        className='brightness-90 md:brightness-75'
      />
      <header
        className='w-full absolute h-full top-10 left-0 flex-center pb-7 md:pb-0 px-4 z-10 flex-col gap-0.5 md:gap-1'
        style={{
          height: 'calc(100% - 48px)',
        }}
      >
        <div className='flex-center gap-1 md:gap-1.5 flex-col '>
          <Tags
            className='text-sm md:text-base items-center justify-start md:justify-center'
            tags={tags}
          />
          <h1 className='font-bold text-3xl md:text-4xl text-white mb-1 text-center'>
            {title}
          </h1>
          <div className='text-sm md:text-base text-white'>{description}</div>
          {date && (
            <div className='text-sm md:text-base text-white flex items-center justify-start md:justify-center gap-1 mx-0.5'>
              <RiTimeLine />
              <time>{new Date(date).toLocaleDateString()}</time>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default CoverImage
