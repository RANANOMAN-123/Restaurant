export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  
  // Products endpoints
  GET_ALL_PRODUCTS: `${API_BASE_URL}/products/all`,
  ADD_PRODUCT: `${API_BASE_URL}/products/add`,
  UPDATE_PRODUCT: (id: string) => `${API_BASE_URL}/products/products/${id}`,
  GET_PRODUCT: (id: string) => `${API_BASE_URL}/products/products/${id}`,
  GET_ZERO_STOCK: `${API_BASE_URL}/products/zero-stock`,
  
  // Orders endpoints
  CREATE_ORDER: `${API_BASE_URL}/orders/order`,
  GET_ORDERS: `${API_BASE_URL}/orders/getdata`,
  UPDATE_ORDER_STATUS: (orderId: string) => `${API_BASE_URL}/orders/${orderId}/status`,
  GET_PRODUCT_COUNTS: `${API_BASE_URL}/orders/product-counts`
};
