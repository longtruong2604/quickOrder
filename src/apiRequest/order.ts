import http from '@/lib/http'
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from '@/schemaValidations/order.schema'

const prefix = '/order'
export const orderApiRequest = {
  createOrder: (body: CreateOrdersBodyType) => http.post<CreateOrdersResType>(`${prefix}/`, body),

  getOrderDetail: (id: number) => http.get<GetOrderDetailResType>(`${prefix}/${id}`),

  updateOrder: (id: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`${prefix}/${id}`, body),

  getOrders: ({ fromDate, toDate }: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(`${prefix}/?fromDate=${fromDate}&toDate=${toDate}`),
}
