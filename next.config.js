require("dotenv").config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  //   experimental: {
  // images: {
  // allowFutureImage: true,
  // },
  //   },
};

module.exports = nextConfig;
