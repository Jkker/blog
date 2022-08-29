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
        className='px-1.5 py-0.5 acrylic text-white bg-white/30 dark:bg-gray-800/30 rounded-xl'
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
  coverImage?: {
    src: string
    dataURIBase64?: string
    blurDataURL?: string
  }
  title?: string
  description?: string
  date?: string
  tags?: string[]
}) {
  const { src, dataURIBase64, blurDataURL } = coverImage

  return (
    <div className='w-full relative h-[260px] sm:h-[320px]'>
      <Image
        src={src}
        alt='Page cover image'
        blurDataURL={blurDataURL || dataURIBase64}
        layout='fill'
        objectFit='cover'
        priority
        className='brightness-90 md:brightness-75'
      />
      <div
        className='w-full absolute h-full top-12 left-0 flex-center pb-7 md:pb-0 px-2 z-10 flex-col gap-0.5 md:gap-1'
        style={{
          height: 'calc(100% - 48px)',
        }}
      >
        <Tags className='flex ' tags={tags} />

        <div className='flex gap-1 md:gap-1.5 flex-col'>
          <h1 className='font-bold text-4xl text-white mb-1'>{title}</h1>
          <div className='text-white'>{description}</div>
          {date && (
            <div className='text-white flex-center gap-1 mx-0.5'>
              <RiTimeLine />
              <time>{new Date(date).toLocaleDateString()}</time>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoverImage
