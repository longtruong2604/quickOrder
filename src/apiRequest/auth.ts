import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'

const authApiRequest = {
  //To prevent duplicate API request
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('api/auth/login', body, { baseUrl: '' }), // baseUrl: "localhost:3000"
  serverLogin: (body: LoginBodyType) =>
    http.post<LoginResType>('auth/login', body), // baseUrl: "localhost:4000"
  logout: () =>
    http.post<MessageResType>('api/auth/logout', null, { baseUrl: '' }), // baseUrl: "localhost:3000"
  serverLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post<MessageResType>(
      'auth/logout',
      { refreshToken: body.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ), // baseUrl: "localhost:4000"

  serverRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>('auth/refresh-token', body),

  //To prevent duplicate API request
  // This is a normal method, so the this keyword will refer to the object that calls the method.
  // Arrow functions do not have their own this keyword. They will inherit the this value from the enclosing scope.
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      '/api/auth/refresh-token',
      null,
      {
        baseUrl: '',
      }
    )
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  },
}
export default authApiRequest
