import { createContext, useContext, useState } from 'react'

interface GlobalContextInterface {
  hasComment: boolean
  setHasComment: (hasComment: boolean) => void
  isMobileTocVisible: boolean
  setIsMobileTocVisible: (isMobileTocVisible: boolean) => void
}

const GlobalContext = createContext<GlobalContextInterface>(
  {} as GlobalContextInterface
)

const GlobalContextProvider = ({ children }) => {
  const [hasComment, setHasComment] = useState(false)
  const [isMobileTocVisible, setIsMobileTocVisible] = useState(true)

  const value = {
    hasComment,
    setHasComment,
    isMobileTocVisible,
    setIsMobileTocVisible,
  }
  return (
    <GlobalContext.Provider value={value}> {children} </GlobalContext.Provider>
  )
}

const useGlobal = () => useContext(GlobalContext)

export default useGlobal
export { GlobalContext, GlobalContextProvider }
