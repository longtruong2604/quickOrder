import http from '@/lib/http'

const revalidateRequest = (tagId: string) => http.get(`api/revalidate?tag=${tagId}`, { baseUrl: '' })
export default revalidateRequest
