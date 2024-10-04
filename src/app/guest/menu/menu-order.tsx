'use client'
import { Button } from '@/components/ui/button'
import { formatCurrency, handleErrorApi } from '@/lib/utils'
import { useGetDishListQuery } from '@/queries/use-dish'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import QuantityCounter from './quantity-counter'
import { useCreateGuestOrderMutation } from '@/queries/use-guest'
import { useToast } from '@/components/ui/use-toast'
import { DishStatus } from '@/constants/type'
import { useRouter } from 'next/navigation'

const MenuOrder = () => {
  const router = useRouter()
  const [orders, setOrder] = useState<GuestCreateOrdersBodyType>([])
  const dishesQuery = useGetDishListQuery()
  const { toast } = useToast()
  const createGuestOrdersMutation = useCreateGuestOrderMutation()
  const dishes = useMemo(() => dishesQuery.data?.payload.data ?? [], [dishesQuery])
  const newTotalPrice = useMemo(
    () =>
      dishes.reduce((acc, dish) => {
        const order = orders.find((order) => order.dishId === dish.id)
        if (!order) return acc
        return acc + dish?.price * order.quantity
      }, 0),
    [dishes, orders]
  )
  const handleOrderChange = (dishId: number, quantity: number) => {
    setOrder((prev) => {
      const newOrders = [...prev]
      const index = newOrders.findIndex((order) => order.dishId === dishId)
      if (quantity === 0) {
        newOrders.filter((item) => item.dishId !== dishId)
      }
      if (index === -1) {
        newOrders.push({ dishId, quantity })
      } else {
        newOrders[index].quantity = quantity
      }
      return newOrders
    })
  }

  const handleOrder = async () => {
    if (createGuestOrdersMutation.isPending) return
    try {
      const guestOrderRes = await createGuestOrdersMutation.mutateAsync(orders)
      router.push(`/guest/orders`)
      toast({ title: guestOrderRes.payload.message })
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div key={dish.id} className="flex gap-4">
            <div className="flex-shrink-0 relative">
              {dish.status === DishStatus.Unavailable && (
                <span className="inset-0 h-full text-sm absolute w-full flex justify-center items-center bg-black/50">
                  Hết hàng
                </span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <QuantityCounter
                onChange={(value) => handleOrderChange(dish.id, value)}
                value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
              />
            </div>
          </div>
        ))}
      <div className="sticky bottom-0">
        <Button onClick={handleOrder} className="w-full justify-between">
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(newTotalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
export default MenuOrder
