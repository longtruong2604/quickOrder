'use client'

import { useToast } from '@/components/ui/use-toast'
import { useSetTokenMutation } from '@/queries/use-auth'
import { useAppStore } from '@/store/app.store'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

const OAuthComp = () => {
  const params = useSearchParams()
  const { setRole, setSocket } = useAppStore()
  const { mutateAsync } = useSetTokenMutation()
  const router = useRouter()
  const { toast } = useToast()
  const message = params.get('message')
  const accessToken = params.get('accessToken')
  const refreshToken = params.get('refreshToken')
  const count = useRef(0)
  useEffect(() => {
    const setTokens = async () => {
      if (accessToken && refreshToken && count.current === 0) {
        count.current = 1
        try {
          const data = await mutateAsync({ accessToken, refreshToken })
          setRole(data.payload.data.role)
          setSocket(data.payload.data.accessToken)
          router.push('/manage/dashboard')
          console.log(data)
        } catch (error) {
          console.log(error)
        }
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
      } else {
        console.log('message', message)
        setTimeout(() => {
          toast({ title: message! })
        })
      }
    }
    setTokens()
  }, [accessToken, refreshToken, router, setRole, setSocket, mutateAsync])
  const status = params.get('status')
  console.log(message, status)
  return <div>Page</div>
}

const OAuthPage = () => (
  <Suspense>
    <OAuthComp />
  </Suspense>
)
export default OAuthPage
