import http from '@/lib/http'

export const revalidateRequest = {
  revalidateTag: (tagId: string) => http.get(`api/revalidate?tag=${tagId}`, { baseUrl: '' }),
}
