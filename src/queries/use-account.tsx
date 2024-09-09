import accountApiRequest from '@/apiRequest/account'
import { AccountResType, UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useAccountListQuery = () => {
  return useQuery({
    queryKey: ['account-list'],
    queryFn: accountApiRequest.list,
  })
}

export const useCreateEmpMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['create-emp'],
    mutationFn: accountApiRequest.createEmp,
    onSuccess: () => {
      // Invalidate the account list query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['account-list'] })
    },
  })
}

export const useCheckEmailExistsMutation = () => {
  return useMutation({
    mutationKey: ['check-email'],
    mutationFn: accountApiRequest.checkEmail,
  })
}

export const useGetEmpQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['get-emp', id],
    queryFn: () => accountApiRequest.getEmp(id),
    enabled,
  })
}

export const useUpdateEmpMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['update-emp'],
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateEmp(body, id),
    onSuccess: () => {
      // Invalidate the account list query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['account-list'] })
    },
  })
}

export const useDeleteEmpMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['delete-emp'],
    mutationFn: accountApiRequest.deleteEmp,
    onSuccess: () => {
      // Invalidate the account list query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['account-list'] })
    },
  })
}
