import accountApiRequest from '@/apiRequest/account'
import { cookies } from 'next/headers'

const DashboardPage = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const result = await accountApiRequest.serverMe(accessToken)
  const name = result.payload.data.name
  return <div>{name}</div>
}
export default DashboardPage
