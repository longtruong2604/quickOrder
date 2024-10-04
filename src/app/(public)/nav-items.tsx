'use client'

import { useAppContext } from '@/components/app-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { Role } from '@/constants/type'
import { handleErrorApi } from '@/lib/utils'
import { useGuestLogoutMutation } from '@/queries/use-guest'
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
    <AlertDialog>
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
      {role && (
        <AlertDialogTrigger asChild>
          <button>Đăng xuất</button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc là mình muốn đăng xuất?</AlertDialogTitle>
          <AlertDialogDescription>Đơn hàng sẽ bị xóa vĩnh viễn</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
