import Image from 'next/image'
import Link from './Link'

export const ProjectCard = ({ title, description, coverImage, href }) => (
  <Link
    href={href}
    aria-label={`Link to ${title}`}
    className='w-full max-w-xl  h-full overflow-hidden shadow-md hover:shadow-xl focus:shadow-xl transition rounded-xl bg-white dark:bg-gray-800'
  >
    <Image
      alt={title}
      src={coverImage}
      objectFit='cover'
      className='object-cover object-center lg:h-48 md:h-36'
      width={576}
      height={306}
    />
    <div className='p-6'>
      <h2 className='mb-3 text-2xl font-bold leading-8 tracking-tight text-black dark:text-gray-50'>
        {title}
      </h2>
      <p className='mb-3 prose text-gray-500 max-w-none dark:text-gray-400'>
        {description}
      </p>
    </div>
  </Link>
)
