import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from './constants/type'
import { decodeToken } from './lib/utils'

const guestPath = ['/guest']
const privatePaths = ['/manage', ...guestPath]
const unAuthPaths = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // pathname: /manage/dashboard
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  // Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  if (refreshToken) {
    console.log('refreshToken', refreshToken)
    // Đăng nhập rồi thì sẽ không cho vào login nữa
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Is authenticated but access token is expired
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL('/refresh-token', request.url)
      // can only logout if refresh token is valid
      url.searchParams.set('refresh_token', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    // Wrong path with wrong permission
    const role = decodeToken(refreshToken).role
    console.log('role', role)
    if (
      (role !== Role.Guest && guestPath.some((path) => pathname.startsWith(path))) ||
      (role === Role.Guest && !guestPath.some((path) => pathname.startsWith(path)))
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login', '/guest/:path*'],
}
