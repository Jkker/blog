import config from '@/site.config'
import Link from 'next/link'
import { BsHeartFill } from 'react-icons/bs'
import { BiCopyright } from 'react-icons/bi'
export const Footer = () => {
  const d = new Date()
  const currentYear = d.getFullYear()
  return (
    <footer className='font-sans flex-shrink-0 justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm p-6'>
      <div
        className='grid w-full gap-2'
        style={{
          gridTemplateColumns: '1fr 16px 1fr',
        }}
      >
        <div className='flex-center place-self-end'>
          <BiCopyright className='mr-0.5' />
          {config.yearStarted}-{currentYear}
        </div>
        <div className='flex-center mt-0.5'>
          <BsHeartFill className='animate-pulse ' />
        </div>
        <div className='place-self-start'>{config.author}</div>
      </div>
      <Link href='/acknowledgement-legal-information'>
        <a className='link'>Acknowledgement / Legal Information</a>
      </Link>
    </footer>
  )
}
