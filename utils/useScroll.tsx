import { useEffect } from 'react'

export default function useScroll(handler, deps) {
  useEffect(() => {
    console.log('useScroll')
    document.addEventListener('scroll', handler)
    return () => {
      document.removeEventListener('scroll', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, ...deps])
}
