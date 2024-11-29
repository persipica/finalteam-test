const nextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  experimental: {
    serverComponentsExternalPackages: ['formidable'], // formidable 외부 패키지 사용 허용
  },
}

export default nextConfig
