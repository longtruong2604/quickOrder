'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import RefreshToken from './refresh-token'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { useRouter } from 'next/navigation'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  },
})

const AppContext = createContext<{ role: undefined | RoleType; setRole: (_role: undefined | RoleType) => void }>({
  role: undefined,
  setRole: (_role: undefined | RoleType) => {},
})

export const useAppContext = () => useContext(AppContext)

const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [roleState, setRoleState] = useState<undefined | RoleType>(undefined)
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodeToken(accessToken).role
      setRoleState(role)
    }
  }, [router])

  const setRole = useCallback((role: undefined | RoleType) => {
    if (role) {
      setRoleState(role)
    } else {
      setRoleState(undefined)
      removeTokensFromLocalStorage()
    }
  }, [])
  return (
    <AppContext.Provider value={{ role: roleState, setRole }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />;
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
export default AppProvider
