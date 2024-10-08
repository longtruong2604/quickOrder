'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAccountMeQuery, useUpdateMeMutation } from '@/queries/use-account'
import { useUploadMedia } from '@/queries/use-media'
import { useToast } from '@/components/ui/use-toast'
import { handleErrorApi } from '@/lib/utils'

export default function UpdateProfileForm() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const { data, refetch } = useAccountMeQuery()
  const uploadMediaMutation = useUploadMedia()
  const updateMeMutation = useUpdateMeMutation()
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      // avatar: "",
    },
  })
  const formAvatar = form.watch('avatar')
  const formName = form.watch('name')

  const onSubmit = async (data: UpdateMeBodyType) => {
    if (updateMeMutation.isPending) return // prevent double submit
    try {
      let body = data
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = uploadRes.payload.data
        body = { ...data, avatar: imageUrl }
      }
      const res = await updateMeMutation.mutateAsync(body)
      toast({
        description: res.payload.message,
      })
      refetch()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }
  const reset = () => {
    setFile(null)
    form.reset()
  }

  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload.data
      console.log(avatar)
      form.setValue('name', name)
      if (avatar) form.setValue('avatar', avatar)
    }
  }, [data, form])

  // const previewAvatar = files ? URL.createObjectURL(file) : avatar; // for NEXTJS 15
  const previewAvatar = useMemo(() => {
    if (file) {
      console.log(file)
      return URL.createObjectURL(file)
    } else return formAvatar
  }, [file, formAvatar])

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e, formAvatar))}
        onReset={reset}
        className="grid auto-rows-max items-start gap-4 md:gap-8"
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatar} className="object-cover " />
                        <AvatarFallback className="rounded-none">{formName}</AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={inputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                          }
                        }}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => inputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input id="name" type="text" className="w-full" {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button size="sm" type="submit">
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
