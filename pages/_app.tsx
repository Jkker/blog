import '@/styles/global.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/lexend/400.css'
import '@fontsource/lexend/700.css'

import { posthogConfig, posthogId } from '@/lib/config'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { useEffect } from 'react'

import { GlobalContextProvider } from '@/utils/useGlobal'
import { ModalProvider } from '@/utils/useModal'

export default function App({ Component, pageProps }: AppProps) {
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
  return (
    <GlobalContextProvider>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </GlobalContextProvider>
  )
}
