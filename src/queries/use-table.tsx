import tablesApiRequest from '@/apiRequest/tables'
import { CreateTableBodyType, UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetTableListQuery = () => {
  return useQuery({
    queryKey: ['table-list'],
    queryFn: tablesApiRequest.getAllTables,
  })
}

export const useGetTableQuery = ({ enabled, id }: { enabled: boolean; id: number }) => {
  return useQuery({
    queryKey: ['get-table', id],
    queryFn: () => tablesApiRequest.getTable(id),
    enabled,
  })
}

export const useCreateTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['create-table'],
    mutationFn: (body: CreateTableBodyType) => tablesApiRequest.createTable(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-list'] })
    },
  })
}

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['update-table'],
    mutationFn: ({ id, ...body }: { id: number } & UpdateTableBodyType) => tablesApiRequest.updateTable(body, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-list'] })
    },
  })
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['delete-table'],
    mutationFn: tablesApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-list'] })
    },
  })
}
