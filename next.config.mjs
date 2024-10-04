/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'longtruong-uploads.s3.ap-southeast-2.amazonaws.com',
        pathname: '/**',
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
