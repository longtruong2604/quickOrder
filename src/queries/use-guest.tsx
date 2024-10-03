import guestApiRequest from '@/apiRequest/guest'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGuestLoginMutation = () => {
  return useMutation({ mutationFn: guestApiRequest.login })
}

export const useGuestLogoutMutation = () => {
  return useMutation({ mutationFn: guestApiRequest.logout })
}

export const useGuestRefreshTokenMutation = () => {
  return useMutation({ mutationFn: guestApiRequest.refreshToken })
}
export const useGetGuestOrderListQuery = () => {
  return useQuery({
    queryKey: ['guest-order-list'],
    queryFn: guestApiRequest.guestOrderList,
  })
}

export const useCreateGuestOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['create-guest-order'],
    mutationFn: guestApiRequest.createGuestOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-order-list'] })
    },
  })
}
