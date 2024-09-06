'use client'
import { useAppContext } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/use-auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, Suspense } from 'react'

const LogoutComponent = () => {
  const router = useRouter()
  const { setIsAuth } = useAppContext()
  const { mutateAsync } = useLogoutMutation()
  const ref = useRef<any>(null)
  const searchParams = useSearchParams()
  const refreshToken = searchParams.get('refresh_token')
  const accessToken = searchParams.get('access_token')

  // prevent double api request
  useEffect(() => {
    if (
      !ref.current &&
      ((refreshToken && refreshToken === getRefreshTokenFromLocalStorage()) ||
        (accessToken && accessToken === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync
      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null
        }, 1000)
        router.push('/login')
        setIsAuth(false)
      })
    } else {
      router.push('/')
    }
  }, [accessToken, mutateAsync, setIsAuth, refreshToken, router])

  return <div>Logout...</div>
}

const LogoutPage = () => {
  return (
    <Suspense fallback={<div>Loading logout...</div>}>
      <LogoutComponent />
    </Suspense>
  )
}

export default LogoutPage
