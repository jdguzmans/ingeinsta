const IS_DEV = process.env.NODE_ENV !== 'production' && !!process.env.REACT_APP_DEV

module.exports = {
  IS_DEV,
  BACKEND_URL: IS_DEV ? process.env.REACT_APP_BACKEND_URL_DEV : process.env.REACT_APP_BACKEND_URL,
  IMAGE_URL: process.env.REACT_APP_IMAGE_URL
}
