'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import socket from '@/lib/socket'
import { formatCurrency } from '@/lib/utils'
import { useGetGuestOrderListQuery } from '@/queries/use-guest'
import { UpdateOrderResType } from '@/schemaValidations/order.schema'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'

const OrderCart = () => {
  const { toast } = useToast()
  const { data: orderListData, refetch } = useGetGuestOrderListQuery()
  const data = useMemo(() => orderListData?.payload.data ?? [], [orderListData])
  const newTotalPrice = useMemo(
    () =>
      data.reduce((acc, dish) => {
        return acc + dish.dishSnapshot.price * dish.quantity
      }, 0),
    [data]
  )
  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }
    function onConnect() {
      console.log('connected', socket.id)
    }

    function onDisconnect() {}

    function updateOrderStatus({ data }: UpdateOrderResType) {
      console.log(data)
      toast({ title: 'Đơn hàng đã được cập nhật' })
      refetch()
    }

    socket.on('update-order', updateOrderStatus)

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [refetch])
  return (
    <>
      {data.map((dish) => (
        <div key={dish.id} className="flex gap-4">
          <div className="flex-shrink-0 ">
            <Image
              src={dish.dishSnapshot.image}
              alt={dish.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{dish.dishSnapshot.name}</h3>
            <p className="text-xs">{dish.dishSnapshot.description}</p>
            <p className="text-xs font-semibold">{formatCurrency(dish.dishSnapshot.price)}</p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <p>x {dish.quantity}</p>
          </div>
          <div className="self-center">
            <Badge variant={'outline'}>{dish.status}</Badge>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <Button className="pointer-events-none w-full justify-end">
          <span>{formatCurrency(newTotalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
export default OrderCart
