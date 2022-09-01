import cx from 'clsx'
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
// const getColorFromTitle = (title: string) => {}

const WeekDayViewContext = createContext(null)
const BG_COLORS = [
  'bg-red-400 dark:bg-red-600',
  'bg-orange-400 dark:bg-orange-600',
  'bg-yellow-400 dark:bg-yellow-600',
  'bg-lime-400 dark:bg-lime-600',
  'bg-green-400 dark:bg-green-600',
  'bg-teal-400 dark:bg-teal-600',
  'bg-cyan-400 dark:bg-cyan-600',
  'bg-blue-400 dark:bg-blue-600',
  'bg-indigo-400 dark:bg-indigo-600',
  'bg-purple-400 dark:bg-purple-600',
  'bg-fuchsia-400 dark:bg-fuchsia-600',
  'bg-rose-400 dark:bg-rose-600',
]

const getBgColor = (title) =>
  BG_COLORS[Math.abs(hash(title)) % BG_COLORS.length]

function useWeekDayViewContext() {
  const context = useContext(WeekDayViewContext)
  if (context === null) {
    const err = new Error(`Missing a valid parent component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err)
    throw err
  }
  return context
}

const EventBlock = ({ title = '', start, end, className = '' }) => {
  const {
    blockWidth,
    blockHeight,
    startHour: dayStartHour,
  } = useWeekDayViewContext()
  const [startH, startM] = start.split(':')
  const [endH, endM] = end.split(':')
  const startHour = parseInt(startH) + parseInt(startM) / 60
  const endHour = parseInt(endH) + parseInt(endM) / 60
  const height = (endHour - startHour) * 2 * blockHeight - 4
  const top = (startHour - dayStartHour) * 2 * blockHeight
  return (
    <div
      className={cx(
        'event-block text-white absolute shadow-lg rounded p-3 z-10',
        className
      )}
      style={{
        height: height,
        margin: 6,
        marginTop: top,
        width: blockWidth - 12,
      }}
    >
      <h4 className='event-block-title'>{title}</h4>
      <div className='event-block-time'>
        {start} - {end}
      </div>
    </div>
  )
}
function hash(str, seed = 0x811c9dc5) {
  /*jshint bitwise:false */
  let hval = seed

  for (let i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }
  return hval >>> 0
}

const NowIndicator = forwardRef<HTMLElement>((props, ref) => {
  const { scheduleContainerWidth, blockHeight, startHour, endHour } =
    useWeekDayViewContext()
  const now = new Date()
  const nowHour = now.getHours() + now.getMinutes() / 60
  const hour = Math.min(endHour + 0.15, Math.max(startHour - 0.15, nowHour))
  const top = (hour - startHour) * 2 * blockHeight + blockHeight
  return (
    <mark
      className={cx(
        'bg-gray-600/70 dark:bg-white/70 h-1 absolute z-20 acrylic rounded shadow'
        // 'before:block before:w-2 before:h-2 before:bg-red-400 before:-mp-1 before:-mt-1 before:position-absolute'
      )}
      style={{
        marginTop: top,
        width: scheduleContainerWidth,
      }}
      ref={ref}
      id='now-indicator'
    >
      {/* {nowHour} */}
    </mark>
  )
})
NowIndicator.displayName = 'NowIndicator'

export const DaySchedule = ({ title, events }) => {
  const { borderColor, blockWidthTW, blockHeightTW, times } =
    useWeekDayViewContext()

  return (
    <div
      className={cx(
        'time-blocks flex flex-col flex-shrink-0 flex-grow-1 relative min-h-full',
        blockWidthTW,
        borderColor
      )}
    >
      <h3
        className={cx(
          'date-title py-4 p-1 md:p-4 text-sm md:text-xl flex h-full items-center text-ellipsis overflow-hidden border-r sticky top-0 z-20 bg-white/70 dark:bg-gray-900/60 acrylic shadow-md dark:shadow-lg',
          borderColor
          // blockHeightTW
        )}
      >
        {title}
      </h3>
      {times.map((t, idx) => (
        <div
          key={t}
          className={cx(
            'w-full border-t flex-none	',
            borderColor,
            blockHeightTW,
            {
              'border-r': idx !== times.length - 1,
            }
          )}
        ></div>
      ))}
      <div className={cx('events absolute left-0 flex-none	')}>
        <div className={cx('', blockHeightTW)}></div>
        <div className='relative'>
          {events.map(([start, end]) => (
            <EventBlock
              key={start + end}
              start={start}
              end={end}
              className={getBgColor(title)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DayViewContainer({
  startHour,
  endHour,
  // onEventClick,
  // format = '24hr',
  blockHeight = 48,
  blockWidth = 192 / 2,
  minDuration = 30,
  children,
  className = '',
}) {
  const times = []
  // for (let hour = startHour; hour <= endHour; hour++) {
  //   for (let minute = 0; minute < 60; minute += minDuration) {
  //     times.push(`${hour}:${minute.toString().padStart(2, '0')}`)
  //   }
  // }
  for (
    let minute = startHour * 60;
    minute <= endHour * 60;
    minute += minDuration
  ) {
    times.push(
      `${Math.floor(minute / 60)}:${(minute % 60).toString().padStart(2, '0')}`
    )
  }
  const borderColor = 'border-black/15 dark:border-gray-600'
  const blockHeightTW = `h-${blockHeight / 4}` || 'h-12'
  const blockWidthTW = `w-${blockWidth / 4}` || 'w-24'
  const scheduleContainerRef = useRef(null)
  const [scheduleContainerWidth, setScheduleContainerWidth] = useState(0)
  // const scheduleContainerWidth = scheduleContainerRef.current?.offsetWidth ?? 0
  const scheduleContainerHeight =
    scheduleContainerRef.current?.offsetHeight ?? 0
  const nowIndicatorRef = useRef(null)
  useEffect(() => {
    setScheduleContainerWidth(scheduleContainerRef.current?.offsetWidth ?? 0)
  }, [scheduleContainerRef.current?.offsetWidth, children])

  return (
    <div
      className={cx(
        'flex w-full overflow-auto relative dark:text-white',
        className
      )}
    >
      {/* Time Scale */}
      <div className='sticky left-0 bg-white/70 dark:bg-gray-900/60 acrylic z-30 flex flex-none  h-full'>
        <div className='time-scale flex flex-col flex-none pl-2 text-right pr-1 -mt-3 w-auto'>
          <div className={cx('flex-none', blockHeightTW)}></div>
          {/* <div className={cx('w-1', blockHeightTW)}></div> */}
          {times.map((t) => (
            <div
              key={t}
              className={cx(
                blockHeightTW,
                'flex-none font-light text-gray-600 dark:text-gray-400'
              )}
            >
              {t}
            </div>
          ))}
        </div>
        {/* Marks */}
        <div className='time-marks flex flex-col flex-none w-2'>
          <div className={cx('border-r', borderColor, blockHeightTW)}></div>
          {times.map((t, idx) => (
            <div
              key={t}
              className={cx(blockHeightTW, borderColor, 'border-t', {
                'border-r': idx !== times.length - 1,
              })}
            >
              {/* {t} */}
            </div>
          ))}
        </div>
      </div>
      {/* Schedule */}
      <WeekDayViewContext.Provider
        value={{
          borderColor,
          blockWidth,
          blockHeight,
          blockHeightTW,
          blockWidthTW,
          startHour,
          endHour,
          times,
          minDuration,
          scheduleContainerWidth,
          scheduleContainerHeight,
        }}
      >
        <div
          className={cx('flex relative')}
          ref={scheduleContainerRef}
          id='schedule-container'
        >
          {children}
          <NowIndicator ref={nowIndicatorRef} />
        </div>
      </WeekDayViewContext.Provider>
    </div>
  )
}

export default {
  DayViewContainer,
  DaySchedule,
}
