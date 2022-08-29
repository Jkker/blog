import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { useEffect } from 'react'

import { posthogConfig, posthogId } from 'lib/config'

function usePosthog() {
  const router = useRouter()

  useEffect(() => {
    function onRouteChangeComplete() {
      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])
}

export default usePosthog

export const PostHog = () => {
  usePosthog()
  return null
}
