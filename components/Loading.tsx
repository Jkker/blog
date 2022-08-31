import { useEffect } from 'react'
import LoadingIcon from '@/public/loading-cat-transparent-120x120.gif'
import Image from 'next/image'
import Fade from './Fade'

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
          zIndex: 9999,
          overflow: 'hidden',
        }}
        className='flex-center bg-gray-900/50 text-white inset-0 acrylic gap-4 lg:gap-8'
      >
        <Image src={LoadingIcon} alt='Loading' width={100} height={100} />
        Loading...
      </div>
    </Fade>
  )
}

export default Loading
