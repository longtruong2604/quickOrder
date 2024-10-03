import guestApiRequest from '@/apiRequest/guest'
import { orderApiRequest } from '@/apiRequest/order'
import { GetOrdersQueryParamsType, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
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
    mutationFn: guestApiRequest.createGuestOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] })
    },
  })
}

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['update-order'],
    mutationFn: ({ id, ...body }: { id: number } & UpdateOrderBodyType) => orderApiRequest.updateOrder(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] })
    },
  })
}

export const useGetOrderDetailQuery = (id: number) => {
  return useQuery({
    queryKey: ['order-detail', id],
    queryFn: () => orderApiRequest.getOrderDetail(id),
  })
}
