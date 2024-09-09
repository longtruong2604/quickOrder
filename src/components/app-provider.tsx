'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import RefreshToken from './refresh-token'
import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  },
})

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (_isAuth: boolean) => {},
})

export const useAppContext = () => useContext(AppContext)

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuthState] = useState(false)
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      setIsAuthState(true)
    }
  }, [])

  const setIsAuth = useCallback((isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true)
    } else {
      setIsAuthState(false)
      removeTokensFromLocalStorage()
    }
  }, [])
  return (
    <AppContext.Provider value={{ isAuth, setIsAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />;
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
export default AppProvider
