import http from '@/lib/http'
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from '@/schemaValidations/order.schema'
import queryString from 'query-string'

const prefix = '/orders'
export const orderApiRequest = {
  createOrder: (body: CreateOrdersBodyType) => http.post<CreateOrdersResType>(`${prefix}/`, body),

  getOrderDetail: (id: number) => http.get<GetOrderDetailResType>(`${prefix}/${id}`),

  updateOrder: (id: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`${prefix}/${id}`, body),

  getOrders: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(`${prefix}/?${queryString.stringify(queryParams)}`),

  makePayment: (body: PayGuestOrdersBodyType) => http.post<PayGuestOrdersResType>(`${prefix}/pay`, body),

  serverMakePayment: (body: PayGuestOrdersBodyType, accessToken: string) =>
    http.post<PayGuestOrdersResType>(`${prefix}/pay`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
}
