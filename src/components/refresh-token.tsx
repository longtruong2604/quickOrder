'use client'
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

    checkAndRefreshToken({
      onError(error) {
        console.error(error)
        clearInterval(interval)
        router.push('/login')
      },
    })
    const TIMEOUT = 1000
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError(error) {
            console.error(error)
            clearInterval(interval)
            router.push('/login')
          },
        }),
      TIMEOUT
    )
    return () => {
      clearInterval(interval)
    }
  }, [pathName, router])
  return <div>Logout...</div>
}
export default RefreshToken
