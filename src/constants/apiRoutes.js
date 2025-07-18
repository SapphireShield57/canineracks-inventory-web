const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const API_ROUTES = {
  LOGIN: `${BASE_URL}/user/login/`,
  REGISTER: `${BASE_URL}/user/register/`,
  VERIFY_CODE: `${BASE_URL}/user/verify-code/`,
  SEND_CODE: `${BASE_URL}/user/send-code/`,
  RESET_PASSWORD: `${BASE_URL}/user/reset-password/`,
  DOG_PROFILE: `${BASE_URL}/user/dog-profile/`,

  PRODUCTS: `${BASE_URL}/inventory/product/`,
  PRODUCT_DETAIL: (id) => `${BASE_URL}/inventory/product/${id}/`,
  RECOMMEND: `${BASE_URL}/inventory/recommend/`,
};