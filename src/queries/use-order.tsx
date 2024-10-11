import { orderApiRequest } from '@/apiRequest/order'
import { GetOrdersQueryParamsType, PayGuestOrdersBodyType, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetOrderListQuery = ({ fromDate, toDate }: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ['order-list', fromDate, toDate],
    queryFn: () => orderApiRequest.getOrders({ fromDate, toDate }),
  })
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['create-order'],
    mutationFn: orderApiRequest.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] })
    },
  })
}

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationKey: ['update-order'],
    mutationFn: ({ id, ...body }: { id: number } & UpdateOrderBodyType) => orderApiRequest.updateOrder(id, body),
  })
}

export const useGetOrderDetailQuery = (id: number) => {
  return useQuery({
    queryKey: ['order-detail', id],
    queryFn: () => orderApiRequest.getOrderDetail(id),
    enabled: !!id,
  })
}

export const usePayOrderMutation = () => {
  return useMutation({
    mutationKey: ['pay-order'],
    mutationFn: (body: PayGuestOrdersBodyType) => orderApiRequest.makePayment(body),
  })
}
