'use client'

import { useAppContext } from '@/components/app-provider'
import { useToast } from '@/components/ui/use-toast'
import { Role } from '@/constants/type'
import { handleErrorApi } from '@/lib/utils'
import { useGuestLogoutMutation } from '@/queries/use-guest-auth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: { title: string; href: string; role?: RoleType[]; hideWhenLoggedIn?: boolean }[] = [
  {
    title: 'Trang chủ',
    href: '/',
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest],
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLoggedIn: true,
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee],
  },
]

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext()
  const router = useRouter()
  const logoutMutation = useGuestLogoutMutation()
  const { toast } = useToast()
  const handleLogout = async () => {
    if (logoutMutation.isPending) return
    try {
      const result = await logoutMutation.mutateAsync()
      toast({ title: result.payload.message })
      setRole(undefined)
      router.push('/')
    } catch (error) {
      handleErrorApi({ error })
    }
  }
  return (
    <>
      <>
        {menuItems.map((item) => {
          const isAuth = role && item.role && item.role.includes(role)
          const canShow = (!item.hideWhenLoggedIn && !item.role) || (!role && item.hideWhenLoggedIn)
          if (canShow || isAuth)
            return (
              <Link href={item.href} key={item.href} className={className}>
                {item.title}
              </Link>
            )
        })}
      </>
      {role && <button onClick={handleLogout}>Đăng xuất</button>}
    </>
  )
}
