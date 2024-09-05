'use client'
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const RefreshTokenComponent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const refreshToken = searchParams.get('refresh_token')
  const redirectUrl = searchParams.get('redirect')

  useEffect(() => {
    if (refreshToken && refreshToken === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () =>
          redirectUrl ? router.push(redirectUrl) : router.push('/login'),
      })
    }
  }, [refreshToken, redirectUrl, router])

  return <div>Refreshing...</div>
}

const RefreshTokenPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshTokenComponent />
    </Suspense>
  )
}

export default RefreshTokenPage
