'use client'
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from '@/lib/utils'
import { useLogoutMutation } from '@/queries/use-auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

const LogoutPage = () => {
  const router = useRouter()
  const { mutateAsync } = useLogoutMutation()
  const ref = useRef<any>(null)
  const searchParams = useSearchParams()
  const refreshToken = searchParams.get('refresh_token')
  const accessToken = searchParams.get('access_token')

  // prevent double api request
  useEffect(() => {
    if (
      ref.current ||
      (refreshToken && refreshToken !== getRefreshTokenFromLocalStorage()) ||
      (accessToken && accessToken !== getAccessTokenFromLocalStorage())
    )
      return
    ref.current = true
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null
      }, 1000)
      router.push('/login')
    })
  }, [accessToken, mutateAsync, refreshToken, router])
  return <div>Logout...</div>
}
export default LogoutPage
