import { cookies } from 'next/headers'
import guestApiRequest from '@/apiRequest/guest'

export async function POST() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: 'Can not find token',
      },
      {
        status: 200,
      }
    )
  }
  try {
    const result = await guestApiRequest.serverLogout({
      refreshToken,
      accessToken,
    })
    return Response.json(result.payload)
  } catch (error) {
    return Response.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 200,
      }
    )
  }
}
