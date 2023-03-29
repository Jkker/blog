import '@/styles/global.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/lexend/400.css'
import '@fontsource/lexend/700.css'
import { ThemeProvider } from 'next-themes'

import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'

import { GlobalContextProvider } from '@/utils/useGlobal'
import { ModalProvider } from '@/utils/useModal'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <ThemeProvider
        attribute='class'
        value={{
          light: 'light-mode',
          dark: 'dark-mode',
        }}
      >
        <ModalProvider>
          <Component {...pageProps} />
          <Analytics />
        </ModalProvider>
      </ThemeProvider>
    </GlobalContextProvider>
  )
}
