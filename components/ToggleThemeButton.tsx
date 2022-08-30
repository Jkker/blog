import { useDarkMode } from 'lib/use-dark-mode'
import { useCallback, useEffect, useState } from 'react'
import { RiMoonFill, RiSunFill } from 'react-icons/ri'
import Button from './Button'
import Rotate from './Rotate'

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
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
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
