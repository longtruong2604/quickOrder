'use client'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/use-auth'
import { useAppStore } from '@/store/app.store'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Logout = () => {
  const { socket, disconnectSocket } = useAppStore()
  const { mutateAsync, isPending } = useLogoutMutation()
  const pathName = usePathname()
  const router = useRouter()
  // prevent double api request
  useEffect(() => {
    const onLogout = async () => {
      console.log('logout')
      if (isPending) return
      try {
        await mutateAsync()
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
  }, [disconnectSocket, isPending, mutateAsync, pathName, router, socket])
  return undefined
}
export default Logout
