const BACKDOOR = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  RFSH: '/api/auth/rfsh',
  GET_PERMISSIONS: (id: number) => `/api/settings/getpermissions/${id}`,
  CREATE_PERMISSIONS: '/api/settings/permissions',
  DELETE_PERMISSION: (token: string) => `/api/settings/deletepermission/${token}`,
  GET_USER: `/api/auth/getusers/`,
  GET_USER_REQUEST: (id: number, accID: number) => `/api/auth/getusers/${id}/${accID}`,
  REMOVE_USER: (id: string) => `/api/auth/removeuser/${id}`,
  ADD_PRODUCT: `/api/menu/addproduct`,
  GET_PRODUCTS: (userID: number) => `/api/menu/getproducts/${userID}`,
  REMOVE_PRODUCT: '/api/menu/removeproduct',
  CREATE_ORDER: `/api/orders/createorder`,
  GET_ORDERS: (token: string) => `/api/orders/getorders/${token}`,
  GET_CATEGORIES: '/api/orders/category',
  CREATE_CATEGORY: '/api/orders/category',
  GENERATE_REPORT: (dateScope: string, timeScope: string) => `/api/accounting/generatereport/${dateScope}/${timeScope}`,
  CLOSE_ORDER: '/api/orders/closeorder',
  CLOSE_ORDER_2: '/api/orders/closeorderV2'
};

export default BACKDOOR;
