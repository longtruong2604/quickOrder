import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import guestAuthApiRequest from '@/apiRequest/guest-auth'

export async function POST() {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json(
      {
        message: 'Can not find refresh token',
      },
      {
        status: 401,
      }
    )
  }
  try {
    const { payload } = await guestAuthApiRequest.serverRefreshToken({
      refreshToken,
    })

    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number
    }
    const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number
    }

    cookieStore.set('refreshToken', payload.data.refreshToken, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'lax',
      expires: new Date(decodedRefreshToken?.exp * 1000),
    })

    cookieStore.set('accessToken', payload.data.accessToken, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'lax',
      expires: new Date(decodedAccessToken?.exp * 1000),
    })

    return Response.json(payload)
  } catch (error: any) {
    return Response.json(
      {
        message: error?.message || 'Something went wrong',
      },
      {
        status: 401,
      }
    )
  }
}
