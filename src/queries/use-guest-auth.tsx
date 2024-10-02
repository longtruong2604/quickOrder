import guestAuthApiRequest from '@/apiRequest/guest-auth'
import { useMutation } from '@tanstack/react-query'

export const useLoginMutation = () => {
  return useMutation({ mutationFn: guestAuthApiRequest.login })
}

export const useLogoutMutation = () => {
  return useMutation({ mutationFn: guestAuthApiRequest.logout })
}

export const useRefreshTokenMutation = () => {
  return useMutation({ mutationFn: guestAuthApiRequest.refreshToken })
}
