import http from '@/lib/http'
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from '@/schemaValidations/table.schema'

const prefix = '/tables'
const tablesApiRequest = {
  getAllTables: () => http.get<TableListResType>(`${prefix}/`),
  getTable: (id: number) => http.get<TableResType>(`${prefix}/${id}`),
  createTable: (body: CreateTableBodyType) => http.post<TableResType>(`${prefix}`, body),
  updateTable: (body: UpdateTableBodyType, id: number) => http.put<TableResType>(`${prefix}/${id}`, body),
  deleteTable: (id: number) => http.delete<TableResType>(`${prefix}/${id}`),
}
export default tablesApiRequest
