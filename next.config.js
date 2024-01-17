/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              '*',
          },
        ],
      },
    ]
  },
  // async headers() {
  //   return [
  //     {
  //       // Routes this applies to
  //       source: '/api/(.*)',
  //       // Headers
  //       headers: [
  //         // Allow for specific domains to have access or * for all
  //         {
  //           key: 'Access-Control-Allow-Origin',
  //           value: '*',
  //           // DOES NOT WORK
  //           // value: process.env.ALLOWED_ORIGIN,
  //         },
  //         // Allows for specific methods accepted
  //         {
  //           key: 'Access-Control-Allow-Methods',
  //           value: 'GET, POST, PUT, DELETE, OPTIONS',
  //         },
  //         // Allows for specific headers accepted (These are a few standard ones)
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value: 'Content-Type, Authorization',
  //         },
  //       ],
  //     },
  //   ]
  // },
  // reactStrictMode: true,
  // experimental: {
  //   // appDir: true,
  //   serverComponentsExternalPackages: [
  //     'fs',
  //     'node-fetch',
  //     'node-fetch/lib',
  //     'encoding',
  //     'swagger-jsdoc',
  //   ],
  // },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aihubenglishwing.s3.ap-southeast-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.icons8.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.randomuser.me',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: [
    'swagger-client',
    'swagger-ui-react',
    '@aws-sdk/s3-request-presigner',
  ],
  webpack: (config) => {
    // ignore formidable warnings
    config.ignoreWarnings = [
      { module: /node_modules\/swagger-jsdoc/ },
      { module: /node_modules\/node-fetch/ },
      { module: /node_modules\/@aws-sdk\/s3-request-presigner/ },

      // { file: /node_modules\/swagger-jsdoc\/src\/index\.js/ },
      // { file: /node_modules\/swagger-jsdoc\/src\/specification\.js/ },
      // { file: /node_modules\/swagger-jsdoc\/src\/lib\.js/ },
      // { file: /node_modules\/next-swagger-doc\/dist\/index\.js/ },
    ]
    // config.resolve = {
    //   ...config.resolve,
    //   fallback: {
    //     fs: false,
    //   },
    // }

    return config
  },
}

module.exports = nextConfig
