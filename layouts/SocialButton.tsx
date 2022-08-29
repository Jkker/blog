import {
  RiGithubFill,
  RiLinkedinBoxFill, RiMailFill,
  RiRssFill, RiTelegramFill
} from 'react-icons/ri'
/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */

const SocialButton = ({ config }) => {
  return (
    <div className='w-full justify-center flex-wrap flex space-x-3 text-xl text-gray-600 dark:text-gray-300 '>
      {config.github && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'github'}
          href={config.github}
        >
          <RiGithubFill className='transform hover:scale-125 duration-150 hover-text-primary' />
        </a>
      )}
      {config.linkedin && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'linkedin'}
          href={config.linkedin}
        >
          <RiLinkedinBoxFill className='transform hover:scale-125 duration-150 hover-text-primary' />
        </a>
      )}
      {config.telegram && (
        <a
          target='_blank'
          rel='noreferrer'
          href={config.telegram}
          title={'telegram'}
        >
          <RiTelegramFill className='transform hover:scale-125 duration-150 hover-text-primary' />
        </a>
      )}
      {config.email && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'email'}
          href={`mailto:${config.email}`}
        >
          <RiMailFill className='transform hover:scale-125 duration-150 hover-text-primary' />
        </a>
      )}
      <a target='_blank' rel='noreferrer' title={'RSS'} href={'/feed'}>
        <RiRssFill className='transform hover:scale-125 duration-150 hover-text-primary' />
      </a>
    </div>
  )
}
export default SocialButton
