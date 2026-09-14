/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para development em porta customizada
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
