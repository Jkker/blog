import { DaySchedule, DayViewContainer } from '@/components/DayView'
import vacancies from '@/data/Vacancy-2022fa.json'

import Loading from '@/components/Loading'
import Select from '@/components/Select'
import Switch from '@/components/Switch'
import locations from '@/data/location_list.json'
import { Layout } from '@/layouts'
import dayjs from '@/lib/dayjs'
import Cover from '@/public/images/nyu.jpg'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { GeolocatedResult } from 'react-geolocated'
import { MdOutlineLocationOn } from 'react-icons/md'

const GeoLocate = dynamic(() => import('@/components/GeoLocate'), {
  ssr: false,
})

export const getStaticProps: GetStaticProps = async (context) => {
  const locations = await fetch(
    'https://raw.githubusercontent.com/Jkker/i-need-space/main/data/location_list.json'
  ).then((res) => res.json())
  return {
    props: {
      locations,
    },
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

type TimeSlots = {
  [key in '0' | '1' | '2' | '3' | '4' | '5' | '6']: string[][]
}

type Location = {
  lat: number
  lng: number
  address: string
  id: string
  url: string
  name: string
  name_nyu: string
  city: string
  borough: string
  rooms: {
    [id: string]: TimeSlots
  }
}

// https://stackoverflow.com/a/11172685/8876594
function measure(lat1, lon1, lat2, lon2) {
  // generally used geo measurement function
  var R = 6378.137 // Radius of earth in KM
  var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180
  var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c
  return d * 1000 // meters
}

const getNearest = (lat: number, lng: number, weekday: number) =>
  Object.entries(vacancies)
    .map(([key, location]) => ({
      key,
      d: measure(lat, lng, location.lat, location.lng),
      N: Object.values(location.rooms).reduce(
        (acc, val) => acc + val[weekday].length,
        0
      ),
      ...location,
    }))
    .sort((a, b) => a.d - b.d)
    .filter(
      (location) =>
        // @ts-ignore
        // weekday in location.rooms && location.rooms[weekday].length > 0
        Object.values(location.rooms).reduce(
          (acc, val) => acc + val[weekday].length,
          0
        ) > 0
    )
    .slice(0, 15)

export default function FindSpace() {
  const now = useMemo(() => dayjs(), [])
  const [isLoading, setIsLoading] = useState(false)
  const [building, setBuilding] = useState('Bobst Library')
  const [borough, setBorough] = useState('Manhattan')
  const [weekday, setWeekday] = useState(now.isoWeekday() - 1)

  const options = locations[borough].sort((a, b) => a.localeCompare(b))

  const [buildingOptions, setBuildingOptions] = useState<string[] | {}[]>(
    options
  )

  const [geoLocated, setGeoLocated] = useState<GeolocatedResult>(
    {} as GeolocatedResult
  )
  const [isLBS, setIsLBS] = useState(false)

  const scrollIntoView = useCallback(
    () => document.getElementById('now-indicator').scrollIntoView(),
    []
  )

  const onBoroughSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBorough(e.target.value)
  }

  const onBuildingSelect = async ({ target }) => {
    const b = target.value
    setBuilding(b)
    scrollIntoView()
  }
  const onWeekdaySelect = ({ target }) => {
    const d = target.value
    setWeekday(d)
    scrollIntoView()
  }

  useEffect(() => {
    if (isLBS && geoLocated.coords) {
      const nearest = getNearest(
        geoLocated.coords.latitude,
        geoLocated.coords.longitude,
        weekday
      )
      console.log(
        `🚀 ~ file: nyu-space.tsx ~ line 139 ~ useEffect ~ nearest`,
        nearest
      )
      setBuildingOptions(
        nearest.map(({ key, d }) => ({
          value: key,
          label: `${key} (${d < 500 ? d + 'm' : (d / 1000).toFixed(1) + 'km'})`,
        }))
      )
      setBuilding(nearest[0].key)
    }
  }, [isLBS, geoLocated.coords, weekday])

  return (
    <Layout title='NYU Unoccupied Space Finder' coverImage={Cover} hasComment>
      {isLBS && (
        <GeoLocate setGeoLocated={setGeoLocated} setIsLoading={setIsLoading} />
      )}
      <div className='space-y-4 md:space-y-8 w-full p-2'>
        <div className='flex space-between gap-2 items-center'>
          <p className='pb-2 font-bold p-1'>
            Find a place to chill-out when you are on campus.
          </p>
          <div className='md:hidden'>
            <Switch checked={isLBS} onChange={setIsLBS} loading={isLoading}>
              <MdOutlineLocationOn /> GPS
            </Switch>
          </div>
        </div>
        <div className='flex gap-4'>
          <div className='flex-1 rounded grid gap-4 md:grid-cols-4'>
            <Select
              name='borough'
              label='Borough'
              className='w-full'
              options={Object.keys(locations).sort((a, b) =>
                a.localeCompare(b)
              )}
              value={borough}
              onChange={onBoroughSelect}
              disabled={isLBS}
            />
            <Select
              name='building'
              label='Select Building'
              placeholder='Select building'
              onChange={onBuildingSelect}
              value={building}
              options={isLBS ? buildingOptions : options}
              className='md:col-span-2'
            />
            <Select
              name='weekday'
              placeholder='Select weekday'
              label='Select Week Day'
              onChange={onWeekdaySelect}
              value={weekday}
              options={WEEKDAYS.map((weekday, idx) => ({
                value: idx,
                label: weekday,
              }))}
            />
          </div>
          <div className='hidden md:flex'>
            <Switch checked={isLBS} onChange={setIsLBS} loading={isLoading}>
              <MdOutlineLocationOn /> GPS
            </Switch>
          </div>
        </div>
        <div className='bg-white dark:bg-gray-800 py-4 rounded shadow-md relative'>
          {<Loading isLoading={isLoading} />}
          <DayViewContainer
            startHour={8}
            endHour={22}
            className='sticky max-h-[75vh]'
          >
            {vacancies[building] &&
              Object.entries(vacancies[building]?.rooms).map(([key, value]) => (
                <DaySchedule
                  key={key}
                  title={key}
                  events={value[weekday] ?? []}
                />
              ))}
          </DayViewContainer>
        </div>
      </div>
    </Layout>
  )
}
