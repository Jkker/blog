import Button from '@/components/Button'
import { Layout } from '@/layouts'
import Cover from '@/public/images/nyu.jpg'
import { useState } from 'react'
import {
  FaCopy as CopyIcon,
  FaDownload as DownloadIcon,
  FaGithub,
  FaGoogle,
} from 'react-icons/fa'

export default function NyuCal(props) {
  const [copied, setCopied] = useState(false)
  return (
    <Layout
      {...props}
      title='NYU Academic Calendar Subscriber'
      coverImage={Cover}
    >
      <div className=' pt-6 mx-3 flex-center text-black dark:text-gray-100'>
        <div className='card space-y-responsive w-full'>
          <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
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
          <h1 className='font-bold text-xl md:text-2xl pt-4'>
            Google Calendar Preview
          </h1>
          <iframe
            src='https://calendar.google.com/calendar/embed?showTitle=0&showCalendars=0&showPrint=0&src=c2t0cDk1OWpoZjdqZG8xdmM0djQwbXBvN3I0anFja2RAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20'
            className='container hidden md:block dark:filter-dark-1'
            // width="800"
            height='400'
            frameBorder='0'
            scrolling='no'
            title='Google Calendar'
          ></iframe>
        </div>
      </div>
    </Layout>
  )
}
