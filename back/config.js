
const isDev = !!process.env.DEV
const isTest = !!process.env.TEST

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: isDev ? process.env.MONGODB_URI_DEV : isTest ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI,
  AWS_BUCKET: isDev ? process.env.AWS_BUCKET_DEV : isTest ? process.env.AWS_BUCKET_TEST : process.env.AWS_BUCKET
}
