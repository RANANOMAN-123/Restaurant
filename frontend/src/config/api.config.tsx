export const API_BASE_URL = 'http://localhost:8187';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  GET_ALL_PRODUCTS: `${API_BASE_URL}/api/products/all`,
  ADD_PRODUCT: `${API_BASE_URL}/api/products/add`,
  UPDATE_PRODUCT: (id: string) => `${API_BASE_URL}/api/products/products/${id}`,
  GET_PRODUCT: (id: string) => `${API_BASE_URL}/api/products/products/${id}`,
  GET_ZERO_STOCK: `${API_BASE_URL}/api/products/zero-stock`,
  DELETE_PRODUCT: (id: string) => `${API_BASE_URL}/api/products/delete/${id}`,
  CREATE_ORDER: `${API_BASE_URL}/api/orders/order`,
  GET_ORDERS: `${API_BASE_URL}/api/orders/getdata`,
  UPDATE_ORDER_STATUS: (orderId: string) => `${API_BASE_URL}/api/orders/${orderId}/status`,
  GET_PRODUCT_COUNTS: `${API_BASE_URL}/api/orders/product-counts`,
  GET_ALL_USERS: `${API_BASE_URL}/api/auth/users`,
  DELETE_USER: (id: string) => `${API_BASE_URL}/api/auth/users/${id}`,
  MAKE_ADMIN: (id: string) => `${API_BASE_URL}/api/auth/users/${id}/make-admin`,
};