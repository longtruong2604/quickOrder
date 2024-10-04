import http from '@/lib/http'
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType,
} from '@/schemaValidations/guest.schema'

const prefix = '/guest'
const guestApiRequest = {
  //To prevent duplicate API request
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,
  login: (body: GuestLoginBodyType) => http.post<GuestLoginResType>(`api${prefix}/auth/login`, body, { baseUrl: '' }), // baseUrl: "localhost:3000"
  serverLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>(`${prefix}/auth/login`, body), // baseUrl: "localhost:4000"
  logout: () => http.post<MessageResType>(`api${prefix}/auth/logout`, null, { baseUrl: '' }), // baseUrl: "localhost:3000"
  serverLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post<MessageResType>(
      `${prefix}/auth/logout`,
      { refreshToken: body.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ), // baseUrl: "localhost:4000"

  serverRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>(`${prefix}/auth/refresh-token`, body),

  //To prevent duplicate API request
  // This is a normal method, so the this keyword will refer to the object that calls the method.
  // Arrow functions do not have their own this keyword. They will inherit the this value from the enclosing scope.
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(`/api${prefix}/auth/refresh-token`, null, {
      baseUrl: '',
    }) as Promise<{
      status: number
      payload: RefreshTokenResType
    }>
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  },

  guestOrderList: () => http.get<GuestGetOrdersResType>(`${prefix}/orders`, { next: { tags: ['orders'] } }),

  createGuestOrder: (body: GuestCreateOrdersBodyType) =>
    http.post<GuestCreateOrdersResType>(`${prefix}/orders`, body, { next: { tags: ['orders'] } }),
}
export default guestApiRequest
