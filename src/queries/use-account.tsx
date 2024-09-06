import accountApiRequest from '@/apiRequest/account'
import { AccountResType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAccountMeQuery = (onSuccess?: (data: AccountResType) => void) => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        onSuccess && onSuccess(res.payload) //executes the callback function if it exists
        return res
      }),
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationKey: ['update-me'],
    mutationFn: accountApiRequest.updateMe,
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationKey: ['change-password'],
    mutationFn: accountApiRequest.changePassword,
  })
}
