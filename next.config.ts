import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generates a minimal, self-contained server in .next/standalone —
  // only the files actually needed at runtime, not the full
  // node_modules. This is what keeps the final Docker image small
  // instead of shipping the entire dependency tree.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
