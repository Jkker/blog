import { useDarkMode } from 'lib/use-dark-mode'
import { RiMoonFill, RiSunFill } from 'react-icons/ri'
import Button from './Button'
import Rotate from './Rotate'

const ToggleThemeButton = ({ className = '', ...props }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <Button
      onClick={toggleDarkMode}
      className={className}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
      {...props}
      icon={
        <Rotate show={isDarkMode}>
          <RiSunFill />
          <RiMoonFill />
        </Rotate>
      }
    />
  )
}

export default ToggleThemeButton
