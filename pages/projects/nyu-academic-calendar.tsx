import { Layout } from '@/layouts'
import { domain, rootNotionPageId } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { PageProps, Params } from 'lib/types'
import { GetStaticProps } from 'next'
import {
  FaCopy as CopyIcon,
  FaDownload as DownloadIcon,
  FaGithub,
  FaGoogle,
} from 'react-icons/fa'
import Button from '@/components/Button'

export default function NyuCal(props) {
  // const toast = useToast()
  return (
    <Layout
      {...props}
      title='NYU Academic Calendar Subscriber'
      coverImage='/images/nyu.jpg'
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
                alert('Subscription URL copied to clipboard')
              }}
              leftIcon={<CopyIcon />}
              title='Copy iCalendar subscription URL to clipboard'
              rounded
            >
              Copy ICS URL
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

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = (context.params?.pageId ?? rootNotionPageId) as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}
