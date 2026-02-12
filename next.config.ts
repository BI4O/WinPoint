import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  // 构建时自动生成静态资源（图片、字体等）
  // 如果有图片优化需求，可以配置 images: { unoptimized: true }
  trailingSlash: false,
};

export default nextConfig;
