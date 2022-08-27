import BLOG from '@/blog.config'
import Card from './Card2'
import SocialButton from './SocialButton'
// import MenuGroupCard from './MenuGroupCard'
import Link from 'next/link'
import avatar from '@/public/avatar.jpg'
import Image from 'next/image'

export function InfoCard({ className }) {
  return (
    <Card className={className}>
      <Link href='/about'>
        <a
          className='justify-center items-center flex py-6 dark:text-gray-100 font-sans transform duration-200 cursor-pointer'
          aria-label='About Author'
        >
          <Image
            src={avatar}
            className='rounded-full'
            width={120}
            height={120}
            alt='avatar'
          />
        </a>
      </Link>
      <Link href='/about'>
        <a
          className='text-center text-xl pb-4 block hover-text-primary hover:scale-105 transition duration-150'
          aria-label='About Author'
        >
          {BLOG.AUTHOR}
        </a>
      </Link>
      <div className='text-sm text-center pb-1'>{BLOG.BIO}</div>
      {/* <MenuGroupCard {...props} /> */}
      <SocialButton />
    </Card>
  )
}
