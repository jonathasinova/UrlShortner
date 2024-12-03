/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/r/:shortId',
        destination: '/api/redirect/:shortId',
      },
    ]
  },
}

module.exports = nextConfig 