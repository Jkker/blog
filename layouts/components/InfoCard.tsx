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
        'space-y-4 shadow-md hover:shadow-lg rounded p-4 pt-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 duration-100' +
        ' ' +
        className
      }
    >
      <Link
        href='/about'
        className='justify-center items-center flex dark:text-gray-100 font-sans transform duration-200 cursor-pointer'
        aria-label='About Author'
      >
        <Image
          src={avatar}
          className='rounded-full'
          width={90}
          height={90}
          alt='avatar'
        />
      </Link>
      <Link
        href='/about'
        className='text-center text-xl block hover-text-primary hover:scale-105 transition duration-150'
        aria-label='About Author'
      >
        {config.author}
      </Link>
      <div className='text-sm text-center'>{config.description}</div>
      {/* <MenuGroupCard {...props} /> */}
      <SocialButton config={config} />
    </section>
  )
}
