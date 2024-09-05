'use client'
import { getRefreshTokenFromStorage } from '@/lib/utils'
import { useRefreshTokenMutation } from '@/queries/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const LogoutPage = () => {
  const router = useRouter()
  const { mutateAsync } = useRefreshTokenMutation()
  const ref = useRef<any>(null)

  // prevent double api request
  useEffect(() => {
    if (!getRefreshTokenFromStorage()) {
      return
    }
    ref.current = true
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null
      }, 1000)
      router.push('/login')
    })
  }, [mutateAsync, router])
  return <div>Refreshing...</div>
}
export default LogoutPage
