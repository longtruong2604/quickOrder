'use client'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useGetDishListQuery } from '@/queries/use-dish'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import QuantityCounter from './quantity-counter'

const MenuOrder = () => {
  const [orders, setOrder] = useState<GuestCreateOrdersBodyType>([])
  const dishesQuery = useGetDishListQuery()
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

  return (
    <>
      {dishes.map((dish) => (
        <div key={dish.id} className="flex gap-4">
          <div className="flex-shrink-0">
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
              dishId={dish.id}
              onChange={handleOrderChange}
              value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
            />
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <Button className="w-full justify-between">
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(newTotalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
export default MenuOrder
