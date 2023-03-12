import { useEffect } from 'react'
import LoadingIcon from '@/public/loading-cat-transparent-120x120.gif'
import Image from 'next/legacy/image'
import Fade from './Fade'
import cx from 'clsx'

function Loading({ isLoading = true, fullscreen = false }) {
  useEffect(() => {
    if (fullscreen) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [fullscreen])

  return (
    <Fade show={isLoading}>
      <div
        style={{
          position: fullscreen ? 'fixed' : 'absolute',
          height: fullscreen ? '100vh' : '100%',
          width: fullscreen ? '100vw' : '100%',
          overflow: 'hidden',
        }}
        className={cx(
          'flex-center bg-gray-900/80 text-white inset-0 acrylic gap-4 lg:gap-8 flex-col',
          fullscreen ? 'z-40' : 'z-30'
        )}
      >
        <Image src={LoadingIcon} alt='Loading' width={100} height={100} />
        Loading...
      </div>
    </Fade>
  )
}

export default Loading
