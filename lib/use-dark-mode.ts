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
  const { resolvedTheme, systemTheme, setTheme } = useTheme()

  const toggleDarkMode = () => {
    if (systemTheme !== resolvedTheme) {
      setTheme('system')
    } else {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
  }

  return {
    isDarkMode: resolvedTheme === 'dark',
    toggleDarkMode,
  }
}
