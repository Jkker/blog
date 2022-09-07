import { FaHome, FaProjectDiagram } from 'react-icons/fa'
import { RiUser3Fill } from 'react-icons/ri'

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
]

export default navLinks
