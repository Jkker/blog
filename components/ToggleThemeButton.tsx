import { RiMoonFill, RiSunFill } from 'react-icons/ri'
import {FaSun, FaMoon} from 'react-icons/fa'
import Button from './Button'
import { useDarkMode } from 'lib/use-dark-mode'
import Rotate from './Rotate'
import { useCallback, useEffect, useState } from 'react'

const ToggleThemeButton = ({ className = '', ...props }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onToggleTheme = useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  if (!mounted) return null
  return (
    <Button
      onClick={onToggleTheme}
      className={className}
      {...props}
      icon={
        <Rotate show={isDarkMode}>
          <RiSunFill />
          <RiMoonFill />
        </Rotate>
      }
    ></Button>
  )
}

export default ToggleThemeButton
