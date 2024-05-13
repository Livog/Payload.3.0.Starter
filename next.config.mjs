import { withPayload } from '@payloadcms/next/withPayload'
import initBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = initBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**'
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_S3_HOSTNAME,
        port: '',
        pathname: '/**'
      }
    ]
  },
  experimental: {
    ppr: true,
    staleTimes: {
      dynamic: 0,
      static: 180
    },
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack']
      }
    )
    fileLoaderRule.exclude = /\.svg$/i

    return config
  }
}

export default withBundleAnalyzer(withPayload(nextConfig))
