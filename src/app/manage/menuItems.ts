import { Home, LineChart, ShoppingCart, Users2, Salad, Table, LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

const menuItems: {
  title: string
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  href: string
  comingSoon?: boolean
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
    title: 'Phân tích',
    Icon: LineChart,
    href: '/manage/analytics',
    comingSoon: true,
  },
  {
    title: 'Nhân viên',
    Icon: Users2,
    href: '/manage/accounts',
  },
]

export default menuItems
