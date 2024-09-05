'use client'
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const LogoutPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const refreshToken = searchParams.get('refresh_token')
  const redirectUrl = searchParams.get('redirect')
  // prevent double api request
  useEffect(() => {
    if (refreshToken && refreshToken === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () =>
          redirectUrl ? router.push(redirectUrl) : router.push('/login'),
      })
    }
  }, [])
  return <div>Refreshing...</div>
}
export default LogoutPage
