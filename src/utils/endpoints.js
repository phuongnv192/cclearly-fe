// API Endpoints
export const ENDPOINT = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  GOOGLE_LOGIN: '/auth/google',
  PROFILE: '/auth/me',

  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  CATEGORIES: '/categories',
  FRAMES: '/products/frames',
  LENSES: '/products/lenses',

  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: (id) => `/orders/${id}`,
  CREATE_ORDER: '/orders',
  CREATE_PRESCRIPTION_ORDER: '/orders/prescription',
  CANCEL_ORDER: (id) => `/orders/${id}/cancel`,
  UPDATE_ORDER_STATUS: (id) => `/orders/${id}/status`,
  ADMIN_ORDERS: '/orders/admin/all',

  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/items',
  UPDATE_CART_ITEM: (itemId) => `/cart/items/${itemId}`,
  REMOVE_CART_ITEM: (itemId) => `/cart/items/${itemId}`,
  CLEAR_CART: '/cart/clear',

  // User
  USER_PROFILE: '/users/profile',
  USER_ORDERS: '/users/orders',
  REQUEST_RETURN: (orderId) => `/users/orders/${orderId}/return`,

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: (userId) => `/admin/users/${userId}`,
  ADMIN_REVENUE: '/admin/revenue',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_LOGS: '/admin/logs',

  // Banners
  BANNERS: '/banners',
  BANNER_DETAIL: (id) => `/banners/${id}`,

  // Promotions
  PROMOTIONS: '/promotions',
  PROMOTION_DETAIL: (id) => `/promotions/${id}`,
  PROMOTION_TOGGLE: (id) => `/promotions/${id}/toggle`,

  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_IMPORT: '/inventory/import',

  // Returns
  RETURNS: '/returns',
  RETURN_DETAIL: (id) => `/returns/${id}`,
  RETURN_APPROVE: (id) => `/returns/${id}/approve`,
  RETURN_REJECT: (id) => `/returns/${id}/reject`,
  RETURN_COMPLETE: (id) => `/returns/${id}/complete`,

  // Order Prescription
  ORDER_PRESCRIPTION: (orderId) => `/orders/${orderId}/prescription`,

  // Upload
  UPLOAD_IMAGE: '/upload/image',
};

// Query Keys for React Query
export const QUERY_KEYS = {
  // Auth
  PROFILE: ['profile'],

  // Products
  PRODUCTS: ['products'],
  PRODUCT_DETAIL: (id) => ['products', id],
  CATEGORIES: ['categories'],

  // Orders
  ORDERS: ['orders'],
  ORDER_DETAIL: (id) => ['orders', id],
  USER_ORDERS: ['user', 'orders'],
  ADMIN_ORDERS: ['admin', 'orders'],

  // Cart
  CART: ['cart'],

  // Admin
  ADMIN_DASHBOARD: ['admin', 'dashboard'],
  ADMIN_USERS: ['admin', 'users'],
  ADMIN_REVENUE: ['admin', 'revenue'],
  ADMIN_SETTINGS: ['admin', 'settings'],
  ADMIN_LOGS: ['admin', 'logs'],

  // Banners
  BANNERS: ['banners'],

  // Promotions
  PROMOTIONS: ['promotions'],

  // Inventory
  INVENTORY: ['inventory'],

  // Returns
  RETURNS: ['returns'],
  RETURN_DETAIL: (id) => ['returns', id],
};
