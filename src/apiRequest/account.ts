import http from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from '@/schemaValidations/account.schema'

const accountApiRequest = {
  me: () => http.get<AccountResType>('/accounts/me'),
  serverMe: (accessToken: string) =>
    http.get<AccountResType>('/accounts/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body),

  changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>('/accounts/change-password', body),

  list: () => http.get<AccountListResType>('/accounts'),
  getEmp: (id: number) => http.get<AccountListResType>(`/accounts/${id}`),
  createEmp: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>('/accounts', body),
  updateEmp: (body: UpdateEmployeeAccountBodyType, id: number) =>
    http.put<AccountResType>(`/accounts/details/${id}`, body),
  deleteEmp: (id: number) => http.delete<AccountResType>(`/accounts/details/${id}`),
  checkEmail: (email: string) => http.head<{ isExist: boolean }>(`/accounts/check-email?email=${email}`),
}
export default accountApiRequest
