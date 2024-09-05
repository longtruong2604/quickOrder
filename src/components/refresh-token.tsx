'use client'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTH_PATHS = ['/login', '/refresh-token', '/logout']

const RefreshToken = () => {
  const pathName = usePathname()
  // prevent double api request
  useEffect(() => {
    if (UNAUTH_PATHS.includes(pathName)) return
    let interval: any = null

    checkAndRefreshToken()
    const TIMEOUT = 1000
    interval = setInterval(checkAndRefreshToken, TIMEOUT)
    return () => {
      clearInterval(interval)
    }
  }, [pathName])
  return <div>Logout...</div>
}
export default RefreshToken
