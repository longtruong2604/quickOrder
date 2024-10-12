import http from '@/lib/http'
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from '@/schemaValidations/indicator.schema'
import { stringify } from 'querystring'

const prefix = '/indicators'
export const indicatorApiRequest = {
  getDashBoard: (queryParams: DashboardIndicatorQueryParamsType) =>
    http.get<DashboardIndicatorResType>(
      `${prefix}/dashboard?${stringify({
        fromDate: queryParams.fromDate.toISOString(),
        toDate: queryParams.toDate.toISOString(),
      })}`
    ),
}
