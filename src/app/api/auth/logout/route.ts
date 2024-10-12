import { cookies } from 'next/headers'
import authApiRequest from '@/apiRequest/auth'
import { HttpError } from '@/lib/http'

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
    console.log(accessToken, refreshToken)
    const result = await authApiRequest.serverLogout({
      refreshToken,
      accessToken,
    })
    return Response.json(result.payload)
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      })
    } else {
      return Response.json(
        {
          message: 'Something went wrong',
          message2: error.message,
        },
        {
          status: 200,
        }
      )
    }
  }
}
