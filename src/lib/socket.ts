import { io } from 'socket.io-client'
import envConfig from '../../config'
import { getAccessTokenFromLocalStorage } from './utils'

// "undefined" means the URL will be computed from the `window.location` object
const URL = envConfig.NEXT_PUBLIC_API_ENDPOINT

const socket = io(URL, {
  auth: { Authorization: `Bearer ${getAccessTokenFromLocalStorage()}` },
})

export default socket
