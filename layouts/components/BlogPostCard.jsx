import Icon from '@/components/Icon'
import Image from 'next/legacy/image'
import Link from 'next/link'
import React from 'react'
import TagItemMini from '../../components/TagItemMini'

const BlogPostCard = ({
  date,
  description,
  index,
  url,
  title,
  tags,
  coverImage,
  icon,
}) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <Link
      href={url}
      className='group w-full shadow-md hover:shadow-lg dark:hover:shadow-black/40 active:shadow-none rounded-xl bg-white dark:bg-gray-800 flex flex-col-reverse lg:flex-row justify-between duration-300 relative'
    >
      <div className='lg:p-8 p-4 flex flex-col w-full'>
        <h2
          className={`replace cursor-pointer text-xl lg:text-2xl font-sans leading-tight text-gray-700 dark:text-gray-100 group-hover:text-primary-400 dark:group-hover:text-primary-500 transition-colors gap-1 lg:gap-1.5 flex items-center`}
        >
          {icon && (
            <Icon icon={icon} size={28} sizeCls='h-6 w-6 lg:h-7 lg:w-7' />
          )}
          {title}
        </h2>

        <time
          className={`flex mt-2 items-center justify-start flex-wrap text-gray-500`}
        >
          {mounted ? new Date(date).toLocaleDateString() : ''}
        </time>

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
    </Link>
  )
}

export default BlogPostCard
