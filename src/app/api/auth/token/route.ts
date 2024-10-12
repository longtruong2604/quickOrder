import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'
import { TokenPayload } from '@/types/jwt.types'

export async function POST(request: Request) {
  const { accessToken, refreshToken } = (await request.json()) as {
    refreshToken: string
    accessToken: string
  }
  const cookieStore = cookies()
  try {
    const decodedAccessToken = jwt.decode(accessToken) as TokenPayload
    const decodedRefreshToken = jwt.decode(refreshToken) as TokenPayload
    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json(
      {
        message: 'Token has been set successfully',
        data: {
          accessToken,
          refreshToken,
          userId: decodedAccessToken.userId,
          role: decodedAccessToken.role,
        },
      },
      { status: 200 }
    )
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
          status: 500,
        }
      )
    }
  }
}
