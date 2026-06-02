/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // @react-pdf/renderer ships its own font/encoding internals that don't
    // survive Next's server bundling — keep it external so it loads at runtime.
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
};

export default nextConfig;
