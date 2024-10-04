import http from '@/lib/http'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'

const prefix = '/dishes'
const dishesApiRequest = {
  list: () => http.get<DishListResType>(`${prefix}/`, { next: { tags: ['dishes'] } }),
  getDish: (id: number) => http.get<DishResType>(`${prefix}/${id}`),
  createDish: (body: CreateDishBodyType) => http.post<DishResType>(`${prefix}`, body),
  updateDish: (body: UpdateDishBodyType, id: number) => http.put<DishResType>(`${prefix}/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`${prefix}/${id}`),
}
export default dishesApiRequest
