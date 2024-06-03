/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  transpilePackages: [
    '@ant-design',
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",]
};

export default nextConfig;
