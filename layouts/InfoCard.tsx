import * as config from '@/lib/config'
import SocialButton from './SocialButton'
// import MenuGroupCard from './MenuGroupCard'
import Link from 'next/link'
import avatar from '@/public/avatar.jpg'
import Image from 'next/image'

export function InfoCard({ className = '' }) {
  return (
    <section
      className={
        'shadow-md hover:shadow-lg rounded p-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 duration-100' +
        ' ' +
        className
      }
    >
      <Link href='/about'>
        <a
          className='justify-center items-center flex py-6 dark:text-gray-100 font-sans transform duration-200 cursor-pointer'
          aria-label='About Author'
        >
          <Image
            src={avatar}
            className='rounded-full'
            width={90}
            height={90}
            alt='avatar'
          />
        </a>
      </Link>
      <Link href='/about'>
        <a
          className='text-center text-xl pb-4 block hover-text-primary hover:scale-105 transition duration-150'
          aria-label='About Author'
        >
          {config.author}
        </a>
      </Link>
      <div className='text-sm text-center pb-1'>{config.description}</div>
      {/* <MenuGroupCard {...props} /> */}
      <SocialButton config={config} />
    </section>
  )
}
