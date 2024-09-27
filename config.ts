import { z } from 'zod'

const configSchema = z.object({
  API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
})

const configProject = configSchema.safeParse({
  API_ENDPOINT: process.env.API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
})

if (!configProject.success) {
  console.error(configProject.error.errors)
  throw new Error('Invalid env config')
}

const envConfig = configProject.data
export default envConfig
