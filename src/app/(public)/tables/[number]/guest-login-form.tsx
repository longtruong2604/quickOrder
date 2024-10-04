'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { useGuestLoginMutation } from '@/queries/use-guest'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useAppContext } from '@/components/app-provider'
import { Role } from '@/constants/type'

export default function GuestLoginForm({ tableNumber }: { tableNumber: string }) {
  const searchParams = useSearchParams()
  const { setRole } = useAppContext()
  const token = searchParams.get('token')
  const { toast } = useToast()
  const router = useRouter()
  const loginMutation = useGuestLoginMutation()
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber: Number(tableNumber) ?? '1',
    },
  })

  const handleSubmit = form.handleSubmit(
    async (data: GuestLoginBodyType) => {
      try {
        const res = await loginMutation.mutateAsync(data)
        router.push('/guest/menu')
        setRole(Role.Guest)
        toast({ title: res.payload.message })
      } catch (error) {
        handleErrorApi({ error })
      }
    },
    (error) => console.error(error)
  )

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-2 max-w-[600px] flex-shrink-0 w-full" noValidate>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
