'use client'

import { useAppContext } from '@/components/app-provider'
import Link from 'next/link'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu',
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false,
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true,
  },
]

export default function NavItems({ className }: { className?: string }) {
  const { role } = useAppContext()
  return menuItems.map((item) => {
    if ((item.authRequired === false && role) || (item.authRequired === true && !role)) return null
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
