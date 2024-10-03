import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'
import { toast } from '@/components/ui/use-toast'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequest/auth'
import { DishStatus, Role, TableStatus } from '@/constants/type'
import envConfig from '../../config'
import { TokenPayload } from '@/types/jwt.types'
import guestApiRequest from '@/apiRequest/guest'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}
export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message,
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000,
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getRefreshTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('refreshToken') : null)

export const getAccessTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('accessToken') : null)

export const setAccessTokenToLocalStorage = (accessToken: string) =>
  isBrowser ? localStorage.setItem('accessToken', accessToken) : null

export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  isBrowser ? localStorage.setItem('refreshToken', refreshToken) : null

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

export const checkAndRefreshToken = async (param?: { onError?: (error?: any) => void; onSuccess?: () => void }) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)

  const now = new Date().getTime() / 1000 - 1
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    param?.onError && param.onError()
    return
  }
  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    // Gọi API refresh token
    const role = decodedRefreshToken.role
    try {
      const res = role === Role.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken() //logout automatically because of http error 401
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError(error)
    }
  }
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case 'Available':
      return 'Có sẵn'
    case 'Unavailable':
      return 'Hết hàng'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case 'Available':
      return 'Có sẵn'
    case 'Reserved':
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export const getTableLink = ({ token, tableId }: { token: string; tableId: number }) => {
  return envConfig.NEXT_PUBLIC_URL + `/tables/${tableId}?token=${token}`
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}
