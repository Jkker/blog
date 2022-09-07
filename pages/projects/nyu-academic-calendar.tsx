import Button from '@/components/Button'
import { Layout } from '@/layouts'
import config from '@/site.config'
import dynamic from 'next/dynamic'
import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import {
  FaCopy as CopyIcon,
  FaDownload as DownloadIcon,
  FaGithub,
  FaGoogle,
} from 'react-icons/fa'

const Comment = dynamic(() => import('@/components/Giscus'), {
  ssr: false,
})

export default function NyuCal(props) {
  const [copied, setCopied] = useState(false)
  return (
    <Layout {...props} hasComment>
      <div className='w-full flex-col gap-4 pt-4 mx-3 flex-center text-black dark:text-gray-100'>
        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full'>
          <Button
            href='https://calendar.google.com/calendar/render?cid=sktp959jhf7jdo1vc4v40mpo7r4jqckd@import.calendar.google.com'
            leftIcon={<FaGoogle />}
            title='Subscribe to Google Calendar'
            className='flex flex-grow-1'
            color='primary'
            rounded
          >
            Google Calendar
          </Button>
          <Button
            onClick={() =>
              fetch(
                'https://raw.githubusercontent.com/Jkker/nyu-academic-calendar/main/data/nyu-academic-calendar.ics'
              )
                .then((resp) => resp.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.style.display = 'none'
                  a.href = url
                  a.download = 'nyu-academic-calendar.ics'
                  document.body.appendChild(a)
                  a.click()
                  window.URL.revokeObjectURL(url)
                })
                .catch(() => alert('oh no!'))
            }
            leftIcon={<DownloadIcon />}
            title='Download iCalendar File'
            rounded
          >
            Download .ics
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard?.writeText?.(
                `https://raw.githubusercontent.com/Jkker/nyu-academic-calendar/main/data/nyu-academic-calendar.ics`
              )
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
              // alert('Subscription URL copied to clipboard')
            }}
            leftIcon={<CopyIcon />}
            title='Copy iCalendar subscription URL to clipboard'
            rounded
            // className={copied ? 'text-gray-600/70 dark:text-gray-100/70' : ''}
          >
            {copied ? 'Copied!' : 'Copy ICS URL'}
          </Button>
          <Button
            leftIcon={<FaGithub />}
            title='Check on Github'
            href='https://github.com/Jkker/nyu-academic-calendar'
            className=''
            rounded
            // color="default"
          >
            View Project
          </Button>
        </div>
        <iframe
          src='https://calendar.google.com/calendar/embed?showTitle=0&showCalendars=0&showPrint=0&src=c2t0cDk1OWpoZjdqZG8xdmM0djQwbXBvN3I0anFja2RAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20'
          className='container dark:filter-dark-1 w-full shadow-md rounded'
          width='100%'
          height='400'
          frameBorder='0'
          scrolling='no'
          title='Google Calendar'
        />
        <div className='w-full md:card'>
          <Comment />
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      ...config.projects.find(
        (tool) => tool.title === 'NYU Academic Calendar Subscriber'
      ),
    },
  }
}
