/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Permissions-Policy", value: "geolocation=(self)" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Supabase Storage (public buckets) — host filled in from env at runtime; allow any https for dev.
      { protocol: "https", hostname: "**" },
    ],
  },
  webpack: (config, { webpack }) => {
    // `stripe` and `nodemailer` are OPTIONAL deps, lazy-imported only when the
    // matching provider is configured (see lib/payments.ts, lib/email). They are
    // intentionally not installed for the zero-key build. Ignoring the unresolved
    // imports lets the dynamic import() throw at runtime so our try/catch falls
    // back gracefully (console email, disabled card payments). `webpack` here is
    // the instance Next passes in — do NOT import it at the top level.
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(nodemailer|stripe)$/,
      }),
    );
    return config;
  },
};

export default nextConfig;
