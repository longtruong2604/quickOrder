import { removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type State = {
  socket: Socket | undefined
  role: undefined | RoleType
}
export type Actions = {
  setSocket: (accessToken: string) => void
  setRole: (role: undefined | RoleType) => void
  disconnectSocket: () => void
}

export const useAppStore = create<State & Actions>()((set) => ({
  role: undefined,
  socket: undefined,
  setRole: (role) =>
    set((state) => {
      if (role) {
        return { ...state, role }
      } else {
        removeTokensFromLocalStorage()
        return { ...state, role: undefined }
      }
    }),
  setSocket: (accessToken: string) =>
    set((state) => ({
      ...state,
      socket: io(process.env.NEXT_PUBLIC_API_ENDPOINT, {
        auth: { Authorization: `Bearer ${accessToken}` },
      }),
    })),
  disconnectSocket: () =>
    set((state) => {
      if (state.socket) {
        state.socket.disconnect()
      }
      return { ...state, socket: undefined }
    }),
}))
