import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
} from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'

const authApiRequest = {
  serverLogin: (body: LoginBodyType) =>
    http.post<LoginResType>('auth/login', body), // baseUrl: "localhost:4000"
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('api/auth/login', body, { baseUrl: '' }), // baseUrl: "localhost:3000"
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
  logout: () =>
    http.post<MessageResType>('api/auth/logout', null, { baseUrl: '' }), // baseUrl: "localhost:3000"
}
export default authApiRequest
