'use client'
import socket from '@/lib/socket'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTH_PATHS = ['/login', '/refresh-token', '/logout']

const RefreshToken = () => {
  const pathName = usePathname()
  const router = useRouter()
  // prevent double api request
  useEffect(() => {
    if (UNAUTH_PATHS.includes(pathName)) return
    let interval: any = null

    const onRefreshToken = (forced?: boolean) =>
      checkAndRefreshToken({
        onError(error) {
          console.error(error)
          clearInterval(interval)
          router.push('/login')
        },
        forced,
      })

    const TIMEOUT = 1000 * 60 * 15
    interval = setInterval(onRefreshToken, TIMEOUT)

    const onConnect = () => {
      console.log('connected', socket.id)
    }

    const onDisconnect = () => {
      console.log('disconnected', socket.id)
    }

    if (socket.connected) {
      socket.on('connect', onConnect)
      socket.on('refresh-token', () => onRefreshToken(true))
      socket.on('disconnect', () => {
        console.log('disconnected')
      })
    }
    return () => {
      clearInterval(interval)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [pathName, router])
  return <div>Logout...</div>
}
export default RefreshToken
