/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.zangia.mn',
      },
      {
        protocol: 'https',
        hostname: 'mtn-prod-bucket.s3.amazonaws.com',
      }
    ],
  },
}

module.exports = nextConfig