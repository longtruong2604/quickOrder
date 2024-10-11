'use client'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/use-auth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppContext } from './app-provider'

const Logout = () => {
  const { socket, disconnectSocket } = useAppContext()
  const logoutMutation = useLogoutMutation()
  const pathName = usePathname()
  const router = useRouter()
  // prevent double api request
  useEffect(() => {
    const onLogout = async () => {
      console.log('logout')
      if (logoutMutation.isPending) return
      try {
        await logoutMutation.mutateAsync()
        disconnectSocket()
        router.push('/')
      } catch (error) {
        handleErrorApi({ error })
      }
    }

    const onDisconnect = () => {
      console.log('disconnected', socket?.id)
    }

    if (socket?.connected) {
      socket?.on('disconnect', () => {
        console.log('disconnected')
      })
      socket?.on('logout', onLogout)
    }
    return () => {
      socket?.off('logout', onLogout)
      socket?.off('disconnect', onDisconnect)
    }
  }, [disconnectSocket, logoutMutation, pathName, router, socket])
  return <div>Logout...</div>
}
export default Logout
