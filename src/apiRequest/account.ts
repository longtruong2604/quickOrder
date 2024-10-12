import http from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  CreateGuestBodyType,
  CreateGuestResType,
  GetGuestListQueryParamsType,
  GetListGuestsResType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from '@/schemaValidations/account.schema'
import { stringify } from 'querystring'
const prefix = '/accounts'
const accountApiRequest = {
  me: () => http.get<AccountResType>(`${prefix}/me`),

  serverMe: (accessToken: string) =>
    http.get<AccountResType>(`${prefix}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>(`${prefix}/me`, body),

  changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>(`${prefix}/change-password`, body),

  list: () => http.get<AccountListResType>(`${prefix}`),

  getEmp: (id: number) => http.get<AccountResType>(`${prefix}/detail/${id}`),

  createEmp: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>(`${prefix}`, body),

  updateEmp: (body: UpdateEmployeeAccountBodyType, id: number) =>
    http.put<AccountResType>(`${prefix}/detail/${id}`, body),

  deleteEmp: (id: number) => http.delete<AccountResType>(`${prefix}/detail/${id}`),

  checkEmail: (email: string) => http.head<{ isExist: boolean }>(`${prefix}/check-email?email=${email}`),

  getGuestList: (queryParams: GetGuestListQueryParamsType) =>
    http.get<GetListGuestsResType>(
      `${prefix}/guests?${stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString(),
      })}`
    ),

  createGuest: (body: CreateGuestBodyType) => http.post<CreateGuestResType>(`${prefix}/guests`, body),
}
export default accountApiRequest
