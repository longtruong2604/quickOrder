'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useEffect, useRef } from 'react'
import { decodeToken, getAccessTokenFromLocalStorage } from '@/lib/utils'
import { useAppStore } from '@/store/app.store'
import { useRouter } from 'next/navigation'
import Logout from './logout'
import RefreshToken from './refresh-token'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const count = useRef(0)
  const { setRole, setSocket, socket } = useAppStore()

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodeToken(accessToken).role
      setRole(role)
      if (count.current === 0 && !socket) {
        setSocket(accessToken)
        count.current++
      }
    }
  }, [router, setSocket, setRole, socket])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Logout />
      <RefreshToken />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
export default AppProvider
