import dishesApiRequest from '@/apiRequest/dish'
import { CreateDishBodyType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetDishListQuery = () => {
  return useQuery({
    queryKey: ['dish-list'],
    queryFn: dishesApiRequest.list,
  })
}

export const useGetDishQuery = ({ enabled, id }: { enabled: boolean; id: number }) => {
  return useQuery({
    queryKey: ['get-dish', id],
    queryFn: () => dishesApiRequest.getDish(id),
    enabled,
  })
}

export const useCreateDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['create-dish'],
    mutationFn: (body: CreateDishBodyType) => dishesApiRequest.createDish(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dish-list'] })
    },
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['update-dish'],
    mutationFn: ({ id, ...body }: { id: number } & UpdateDishBodyType) => dishesApiRequest.updateDish(body, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dish-list'] })
    },
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['delete-dish'],
    mutationFn: dishesApiRequest.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dish-list'] })
    },
  })
}
