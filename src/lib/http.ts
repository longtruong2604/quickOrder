import { redirect } from 'next/navigation'
import { normalizePath, removeTokensFromLocalStorage } from './utils'
import { LoginResType } from '@/schemaValidations/auth.schema'
import envConfig from '../../config'

type CustomOptions = Omit<RequestInit, 'method'> & {
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.API_ENDPOINT:http://localhost:4000
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server:http://localhost:3000
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}
export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({ status, payload, message = 'Http Error' }: { status: number; payload: any; message?: string }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}
export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ status, payload, message: 'Entity Error' })
    this.status = status
    this.payload = payload
  }
}
class SessionToken {
  private token = ''
  private expiresAt = new Date().toISOString()
  get value() {
    return this.token
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === 'undefined') {
      throw new Error('Cannot set token on server side')
    }
    this.token = token
  }

  get expiredDate() {
    return this.expiresAt
  }
  set expiredDate(newExpiredDate: string) {
    this.expiresAt = newExpiredDate
  }
}

export const clientSessionToken = new SessionToken()
let clientLogoutRequest: null | Promise<any> = null
const isClient = typeof window !== 'undefined'

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD',
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined
  if (options?.body instanceof FormData) body = options.body
  else if (options?.body) body = JSON.stringify(options.body)

  const baseHeaders: { [key: string]: string } = body instanceof FormData ? {} : { 'Content-Type': 'application/json' }

  if (isClient) {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) baseHeaders['Authorization'] = `Bearer ${accessToken}`
  }

  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.API_ENDPOINT:http://localhost:4000
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server:http://localhost:3000
  const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl

  const fullUrl = `${baseUrl}/${normalizePath(url)}`
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  })

  const payload: Response = method === 'HEAD' ? undefined : await res.json()
  const data = {
    status: res.status,
    payload,
  }

  // Interceptor là nơi chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: EntityErrorPayload
        }
      )
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch('/api/auth/logout', {
            method: 'POST',
            body: null,
            headers: {
              ...baseHeaders,
            } as any,
          })
          try {
            await clientLogoutRequest
          } catch (error) {
          } finally {
            removeTokensFromLocalStorage()
            clientLogoutRequest = null
            location.href = '/login'
            // Maybe cause infinite loop, remember to check here
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split('Bearer ')[1]
        redirect(`/logout?accessToken=${accessToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    const normalizeUrl = normalizePath(url)
    if (['api/auth/login', 'api/guest/auth/login'].includes(normalizeUrl)) {
      localStorage.setItem('accessToken', (payload as LoginResType).data.accessToken)
      localStorage.setItem('refreshToken', (payload as LoginResType).data.refreshToken)
    } else if (['api/auth/logout', 'api/guest/auth/logout'].includes(normalizeUrl)) {
      removeTokensFromLocalStorage()
    }
  }
  return data
}
const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    console.log('hehe')
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body })
  },
  head<Response>(url: string, options?: CustomOptions | undefined) {
    return request<Response>('HEAD', url, { ...options })
  },
  delete<Response>(url: string, options?: CustomOptions | undefined) {
    return request<Response>('DELETE', url, { ...options })
  },
}
export default http
