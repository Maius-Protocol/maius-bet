module.exports = {
  experimental: {
    newNextLinkBehavior: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    "@refinedev/antd",
    "@refinedev/inferencer",
    "antd",
    "@ant-design/pro-components",
    "@ant-design/pro-layout",
    "@ant-design/pro-utils",
    "@ant-design/pro-provider",
    "rc-pagination",
    "rc-picker",
  ],
};
