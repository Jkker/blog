// import useDarkModeImpl from '@fisch0920/use-dark-mode'

// export function useDarkMode() {
//   const darkMode = useDarkModeImpl(false, { classNameDark: 'dark-mode' })

//   return {
//     isDarkMode: darkMode.value,
//     toggleDarkMode: darkMode.toggle,
//   }
// }

import { useTheme } from 'next-themes'

export function useDarkMode() {
  const { theme, setTheme } = useTheme()

  return {
    isDarkMode: theme === 'dark',
    toggleDarkMode: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  }
}
