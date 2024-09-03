/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving
  basePath: "",
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
};

export default nextConfig;
