import { createContext, useContext, useState } from 'react'

export type BreadCrumb = {
  title: string
  url: string
  icon?: string
}

interface GlobalContextInterface {
  isMobileTocVisible: boolean
  setIsMobileTocVisible: (isMobileTocVisible: boolean) => void
  breadcrumbs: BreadCrumb[]
  setBreadcrumbs: (breadcrumbs: BreadCrumb[]) => void
}

const GlobalContext = createContext<GlobalContextInterface>(
  {} as GlobalContextInterface
)

const GlobalContextProvider = ({ children }) => {
  const [isMobileTocVisible, setIsMobileTocVisible] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumb[]>([])

  const value = {
    isMobileTocVisible,
    setIsMobileTocVisible,
    breadcrumbs,
    setBreadcrumbs,
  }
  return (
    <GlobalContext.Provider value={value}> {children} </GlobalContext.Provider>
  )
}

const useGlobal = () => useContext(GlobalContext)

export default useGlobal
export { GlobalContext, GlobalContextProvider }
