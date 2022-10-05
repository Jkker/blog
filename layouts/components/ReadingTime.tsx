import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { RiTimeLine } from 'react-icons/ri'
import readingTime from 'reading-time'

function ReadingTime() {
  const { isFallback } = useRouter()
  const [readTime, setReadTime] = useState('')

  useEffect(() => {
    if (isFallback) return
    setTimeout(() => {
      const text = document.querySelector('main')?.textContent as string
      if (!text || text.length === 0) return
      const { minutes } = readingTime(text)
      const i18n = new Intl.NumberFormat(undefined, {
        unit: 'minute',
        style: 'unit',
        unitDisplay: 'short',
      })

      const minuteText = i18n.format(Math.ceil(minutes))
      setReadTime(minuteText)
    }, 1)
  }, [isFallback])

  if (!readTime) return null

  return (
    <li className='text-white flex items-center gap-1 mx-0.5 whitespace-nowrap'>
      <RiTimeLine />
      {readTime}
    </li>
  )
}

export default ReadingTime
