// import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import TagItemMini from './TagItemMini'
import Image from 'next/image'

const BlogPostCard = ({
  date,
  description,
  index,
  url,
  title,
  tags,
  coverImage,
}) => {
  return (
    <Link href={url}>
      <a className='group w-full shadow-md hover:shadow-lg dark:hover:shadow-black/40 active:shadow-none rounded-xl bg-white dark:bg-gray-800 flex flex-col-reverse lg:flex-row justify-between duration-300 relative'>
        <div className='lg:p-8 p-4 flex flex-col w-full'>
          <h2
            className={`replace cursor-pointer text-2xl font-sans leading-tight text-gray-700 dark:text-gray-100 group-hover:text-primary-400 dark:group-hover:text-primary-500 transition-colors`}
          >
            {title}
          </h2>

          <div
            className={`flex mt-2 items-center justify-start flex-wrap text-gray-500`}
          >
            {new Date(date).toLocaleDateString()}
          </div>

          <p
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '4',
              WebkitBoxOrient: 'vertical',
            }}
            className='replace h-full max-h-32 my-4 text-gray-700  dark:text-gray-300 text-sm font-light leading-7'
          >
            {description ?? 'description'}
          </p>

          <div className='text-gray-400 dark:text-gray-300 justify-between flex gap-2'>
            {/* <Link href={category} passHref>
              <a className='cursor-pointer font-light text-sm  hover-text-primary transform whitespace-nowrap'>
                <span className='mr-1 far fa-folder' />
                {category}
              </a>
            </Link> */}
            <div className='flex gap-1.5 flex-wrap justify-end'>
              {tags.map((tag) => (
                <TagItemMini key={tag.name} tag={tag} />
              ))}
            </div>
          </div>
        </div>

        <div className='w-full rounded-t-xl lg:rounded-r-xl lg:rounded-tl-none cursor-pointer duration-200 transform overflow-hidden h-52 lg:h-64 relative'>
          <Image
            src={coverImage.src}
            alt={title}
            blurDataURL={coverImage.dataURIBase64}
            layout='fill'
            objectFit='cover'
            priority={index < 3 ? true : false}
          />
        </div>
      </a>
    </Link>
  )
}

export default BlogPostCard
