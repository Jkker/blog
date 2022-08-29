import Button from '@/components/Button'
import { DaySchedule, DayViewContainer } from '@/components/DayView'
import dict from '@/data/Slots-2022sp.json'

import { Layout } from '@/layouts'
import dayjs from '@/lib/dayjs'
import { domain, rootNotionPageId } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { PageProps, Params } from 'lib/types'
import { GetStaticProps } from 'next'
import { useEffect, useMemo, useState } from 'react'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = (context.params?.pageId ?? rootNotionPageId) as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return {
      props: {
        ...props,
        buildings: Object.keys(dict),
      },
      revalidate: 10,
    }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export default function FindSpace({ buildings, ...props }) {
  const now = useMemo(() => dayjs(), [])
  // const [isLoading, setIsLoading] = useState(false)
  const [building, setBuilding] = useState('Bobst Library')
  const [weekday, setWeekday] = useState(now.isoWeekday() - 1)
  const [rooms, setRooms] = useState([])

  const onBuildingSelect = async ({ target }) => {
    const b = target.value
    setBuilding(b)
    await fetchRooms(b)
  }
  const onWeekdaySelect = ({ target }) => {
    const d = target.value
    setWeekday(d)
  }

  const fetchRooms = async (building) => {
    // setIsLoading(true)
    const data = await fetch(
      `/api/getRoomByBuilding?building=${encodeURIComponent(building)}`
    )
    const rooms = await data.json()
    setRooms(rooms)
    // setIsLoading(false)
    return rooms
  }

  useEffect(() => {
    fetchRooms(building)
  }, [building])

  return (
    <Layout title='NYU Unoccupied Space Finder' coverImage='/images/nyu.jpg'>
      <div className='space-y-4 md:space-y-8 w-full p-2'>
        <p className='pb-2 font-bold p-1'>
          Find a place to chill-out when you are on campus.
        </p>
        <div className='rounded flex gap-4 flex-col md:flex-row'>
          <fieldset className='flex-1'>
            <label htmlFor='building' className='text-sm'>
              Select Building
            </label>
            <select
              name='building'
              aria-label='select building'
              className='input'
              placeholder='Select building'
              onChange={onBuildingSelect}
              value={building}
              id='building'
            >
              {buildings.map((building) => (
                <option key={building} value={building} className='p-4'>
                  {building}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className='flex-1'>
            <label htmlFor='weekday' className='text-sm'>
              Select Week Day
            </label>
            <select
              name='weekday'
              placeholder='Select weekday'
              className='input'
              onChange={onWeekdaySelect}
              value={weekday}
              id='weekday'
            >
              {WEEKDAYS.map((weekday, idx) => (
                <option key={weekday} value={idx}>
                  {weekday}
                </option>
              ))}
            </select>
          </fieldset>
        </div>
        <div className='bg-white dark:bg-gray-800 py-4 rounded shadow-md'>
          <DayViewContainer
            startHour={8}
            endHour={22}
            className='sticky max-h-[75vh]'
          >
            {Object.entries(rooms).map(([roomName, roomSchedule]) => (
              <DaySchedule
                key={roomName}
                title={roomName}
                events={roomSchedule[weekday]}
              />
            ))}
          </DayViewContainer>
        </div>

        {/* <div className="w-full overflow-x-auto p-4 bg-white dark:bg-gray-800 rounded">
          <DataTable columns={columns} data={rooms} />
        </div> */}
        <div className='w-full flex justify-center'>
          <Button
            // isLoading={isLoading}
            onClick={() => fetchRooms(building)}
            className='w-full'
            color='primary'
            rounded
            // isFullWidth={{ base: true, sm: false }}
          >
            Check Availabilities
          </Button>
        </div>
      </div>
    </Layout>
  )
}
