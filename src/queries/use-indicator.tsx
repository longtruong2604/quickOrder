import { indicatorApiRequest } from '@/apiRequest/indicator'
import { DashboardIndicatorQueryParamsType } from '@/schemaValidations/indicator.schema'
import { useQuery } from '@tanstack/react-query'

export const useGetDashboardIndicatorQuery = (queryParams: DashboardIndicatorQueryParamsType) => {
  return useQuery({
    queryKey: ['dashboard-indicator', queryParams],
    queryFn: () => indicatorApiRequest.getDashBoard(queryParams),
  })
}
