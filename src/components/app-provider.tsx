'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
// import RefreshToken from './refresh-token'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { useRouter } from 'next/navigation'
import RefreshToken from './refresh-token'
import { io, type Socket } from 'socket.io-client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const AppContext = createContext<{
  role: undefined | RoleType
  setRole: (_role: undefined | RoleType) => void
  socket: Socket | undefined
  setSocket: (accessToken: string) => void
  disconnectSocket: () => void
}>({
  role: undefined,
  setRole: (_role: undefined | RoleType) => {},
  socket: undefined,
  setSocket: (_accessToken: string) => {},
  disconnectSocket: () => {},
})

export const useAppContext = () => useContext(AppContext)

const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [roleState, setRoleState] = useState<undefined | RoleType>(undefined)
  const [socket, setSocketState] = useState<Socket | undefined>(undefined)

  const setSocket = useCallback((accessToken: string) => {
    console.log('setSocket')
    const URL = process.env.NEXT_PUBLIC_API_ENDPOINT
    const socket = io(URL, {
      auth: { Authorization: `Bearer ${accessToken}` },
    })
    setSocketState(socket)
  }, [])

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect()
    }
    setSocketState(undefined)
  }
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodeToken(accessToken).role
      setRoleState(role)
      console.log('setSocketttt')
      setSocket(accessToken)
    }
  }, [router, setSocket])

  const setRole = useCallback((role: undefined | RoleType) => {
    if (role) {
      setRoleState(role)
    } else {
      setRoleState(undefined)
      removeTokensFromLocalStorage()
    }
  }, [])
  return (
    <AppContext.Provider value={{ role: roleState, setRole, socket, setSocket, disconnectSocket }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />;
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
export default AppProvider
