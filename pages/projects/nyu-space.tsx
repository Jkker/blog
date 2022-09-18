import Button from '@/components/Button'
import { DaySchedule, DayViewContainer } from '@/components/DayView'
import Loading from '@/components/Loading'
import Select from '@/components/Select'
import Switch from '@/components/Switch'
import locations from '@/data/location_list.json'
import vacancyData from '@/data/Vacancy-2022fa.json'
import { Layout } from '@/layouts'
import dayjs from '@/lib/dayjs'
import config from '@/site.config'
import useModal from '@/utils/useModal'
import dynamic from 'next/dynamic'
import { GetStaticProps } from 'next'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { GeolocatedResult } from 'react-geolocated'
import { MdOutlineLocationOn } from 'react-icons/md'
import { TiWarning } from 'react-icons/ti'

const Comment = dynamic(() => import('@/layouts/components/Giscus'), {
  ssr: false,
})

const GeoLocate = dynamic(() => import('@/components/GeoLocate'), {
  ssr: false,
})

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

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

const getNearest = (lat: number, lng: number) =>
  Object.entries(vacancyData)
    .map(([key, location]) => ({
      key,
      d: measure(lat, lng, location.lat, location.lng),
      ...location,
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 15)

const hourMinuteStr2Minute = (hourMinuteStr) => {
  const [h, m] = hourMinuteStr.split(':')
  return parseInt(h) * 60 + parseInt(m)
}

const durationFilter =
  (duration) =>
  ([start, end]) =>
    hourMinuteStr2Minute(end) - hourMinuteStr2Minute(start) >= duration

const weekdayFilter = (time: 'any' | 'now') => {
  if (time === 'any') return () => true
  const now = new Date()
  const timeMinutes = now.getHours() * 60 + now.getMinutes()
  return ([start, end]) => {
    const s = hourMinuteStr2Minute(start)
    const e = hourMinuteStr2Minute(end)
    return s <= timeMinutes && timeMinutes <= e
  }
}

const getVacancies = (
  building: string,
  {
    weekday,
    time = 'now',
    duration = 30,
  }: {
    weekday: number
    time?: 'any' | 'now'
    duration?: number
  }
) => {
  const rooms = vacancyData[building]?.rooms
  const durationLongerThanMinimum = durationFilter(duration)
  const durationIncludesTime = weekdayFilter(time)
  const filtered = Object.entries(rooms)
    .map(([room, vacancies]) => [
      room,
      vacancies[weekday].filter(durationLongerThanMinimum),
    ])
    .filter(([room, vacancies]) => vacancies.some(durationIncludesTime))

  return filtered
}

export default function FindSpace(props) {
  const now = useMemo(() => dayjs(), [])
  const [isLoading, setIsLoading] = useState(false)
  const [building, setBuilding] = useState('Bobst Library')
  const [borough, setBorough] = useState('Manhattan')
  const [weekday, setWeekday] = useState(now.isoWeekday() - 1)
  const [time, setTime] = useState<'any' | 'now'>('any')
  const { openModal, closeModal } = useModal()

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

  const onBuildingSelect = ({ target }) => {
    const b = target.value
    setBuilding(b)
    scrollIntoView()
  }
  const onWeekdaySelect = ({ target }) => {
    const d = target.value
    setWeekday(d)
    scrollIntoView()
  }
  const onTimeSelect = ({ target }) => {
    const t = target.value
    setTime(t)
    scrollIntoView()
  }

  useEffect(() => {
    if (isLBS && geoLocated.coords) {
      const nearest = getNearest(
        geoLocated.coords.latitude,
        geoLocated.coords.longitude
      )
      if (nearest.length > 0) {
        setBuildingOptions(
          nearest.map(({ key, d }) => ({
            value: key,
            label: `${key} (${
              d < 500 ? Math.round(d) + 'm' : (d / 1000).toFixed(1) + 'km'
            })`,
          }))
        )
        setBuilding(nearest[0]?.key)
        setBorough(nearest[0]?.borough)
      } else {
        openModal({
          title: <>No space found</>,
          icon: <TiWarning />,
          content: 'Sorry, no space is available nearby',
          onClose: () => {
            setIsLBS(false)
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLBS, geoLocated.coords, weekday])

  const onGPSFailed = () =>
    openModal({
      title: <>Location is not enabled</>,
      icon: <TiWarning />,
      content: (
        <>
          <Button
            href='https://www.google.com/search?q=how+to+turn+on+location'
            color='primary'
          >
            Google how to enable on location
          </Button>
          <div className='grid grid-cols-2 gap-4'>
            <Button
              onClick={() => {
                window.location.reload()
              }}
            >
              Reload
            </Button>
            <Button
              onClick={() => {
                closeModal()
                setIsLBS(false)
                setIsLoading(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      ),
      onClose: () => {
        setIsLBS(false)
        setIsLoading(false)
      },
    })

  useEffect(() => {
    if (isLBS && geoLocated.isGeolocationEnabled === false) {
      onGPSFailed()
    }
    if (isLBS) {
      setTimeout(() => {
        setGeoLocated((prev) => {
          if (prev.isGeolocationEnabled === true && prev.coords === undefined) {
            onGPSFailed()
          }
          return prev
        })
      }, 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoLocated, isLBS])

  return (
    <Layout {...props} hasComment>
      {isLBS && (
        <GeoLocate setGeoLocated={setGeoLocated} setIsLoading={setIsLoading} />
      )}
      <div className='space-y-4 md:space-y-8 w-full p-2'>
        <div className='flex space-between gap-2 items-center w-full'>
          <p className='pb-2 font-bold p-1 w-full'>
            Find a place to chill-out when you are on campus.
          </p>
          <div className='md:hidden'>
            <Switch checked={isLBS} onChange={setIsLBS} loading={isLoading}>
              <MdOutlineLocationOn /> GPS
            </Switch>
          </div>
        </div>
        <div className='flex gap-4'>
          <div className='flex-1 rounded grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-5'>
            <Select
              name='borough'
              label='Borough'
              options={Object.keys(locations).sort((a, b) =>
                a.localeCompare(b)
              )}
              value={borough}
              onChange={onBoroughSelect}
              disabled={isLBS}
            />
            <Select
              name='building'
              label='Building'
              placeholder='Building'
              onChange={onBuildingSelect}
              value={building}
              options={isLBS ? buildingOptions : options}
              className='md:col-span-2'
            />
            <Select
              name='weekday'
              placeholder='Weekday'
              label='Weekday'
              onChange={onWeekdaySelect}
              value={weekday}
              options={WEEKDAYS.map((weekday, idx) => ({
                value: idx,
                label: weekday,
              }))}
            />
            <Select
              name='time'
              placeholder='Time'
              label='Time'
              onChange={onTimeSelect}
              value={time}
              options={[
                { value: 'any', label: 'Any time' },
                {
                  value: 'now',
                  label: 'Now',
                },
              ]}
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
            {getVacancies(building, {
              weekday,
              time,
              duration: 30,
            }).map(([room, vacancies]) => (
              <DaySchedule key={room} title={room} events={vacancies ?? []} />
            ))}
          </DayViewContainer>
        </div>
        <div className='pt-8 md:card'>
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
        (tool) => tool.title === 'NYU Unoccupied Space Finder'
      ),
    },
  }
}
