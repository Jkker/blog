import { RiUser3Fill } from 'react-icons/ri'
import { FaProjectDiagram, FaHome, FaCode } from 'react-icons/fa'

type NavLink = {
  title: string
  url: string
  icon?: React.ReactNode
  pageId?: string
}

const navLinks: NavLink[] = [
  {
    title: 'Home',
    url: '/',
    icon: <FaHome />,
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: <FaProjectDiagram />,
  },
  {
    title: 'About',
    url: '/about',
    icon: <RiUser3Fill />,
    pageId: '6ce65fc4d4be42e8b613cb8e6558c4cf',
  },
  {
    title: 'Test',
    pageId: '067dd719a912471ea9a3ac10710e7fdf',
    icon: <FaCode />,
    url: '/test',
  },
]

export default navLinks
