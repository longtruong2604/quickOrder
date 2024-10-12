import { Role } from '@/constants/type'
import { RoleType } from '@/types/jwt.types'
import { Home, ShoppingCart, Users2, Salad, Table, LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

const menuItems: {
  title: string
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  href: string
  roles?: RoleType[]
}[] = [
  {
    title: 'Dashboard',
    Icon: Home,
    href: '/manage/dashboard',
  },
  {
    title: 'Đơn hàng',
    Icon: ShoppingCart,
    href: '/manage/orders',
  },
  {
    title: 'Bàn ăn',
    Icon: Table,
    href: '/manage/tables',
  },
  {
    title: 'Món ăn',
    Icon: Salad,
    href: '/manage/dishes',
  },

  {
    title: 'Nhân viên',
    Icon: Users2,
    href: '/manage/accounts',
    roles: [Role.Owner],
  },
]

export default menuItems
