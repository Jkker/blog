import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/lexend/400.css'
import '@fontsource/lexend/700.css'
import 'katex/dist/katex.min.css'
import '@/styles/global.css'

import * as React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'

import { posthogId, posthogConfig } from 'lib/config'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
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

  return <Component {...pageProps} />
}
