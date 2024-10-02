import guestAuthApiRequest from '@/apiRequest/guest-auth'
import { useMutation } from '@tanstack/react-query'

export const useGuestLoginMutation = () => {
  return useMutation({ mutationFn: guestAuthApiRequest.login })
}

export const useGuestLogoutMutation = () => {
  return useMutation({ mutationFn: guestAuthApiRequest.logout })
}

export const useGuestRefreshTokenMutation = () => {
  return useMutation({ mutationFn: guestAuthApiRequest.refreshToken })
}
