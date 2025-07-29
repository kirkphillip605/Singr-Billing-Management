/** @type {import('next').NextConfig} */
    const nextConfig = {
      output: 'export',
      distDir: '```javascript
    'dist',
      eslint: {
        ignoreDuringBuilds: true,
      },
      images: { unoptimized: true },
    };

    module.exports = nextConfig;
