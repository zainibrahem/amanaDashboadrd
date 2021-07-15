// ** Auth Endpoints
export default {
  loginEndpoint: 'https://amanacart.com/api/admin/auth/login',
  registerEndpoint: 'https://amanacart.com/api/admin/auth/register',
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: 'https://amanacart.com/api/admin/auth/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'token',
  // BYFmJx33YrTVv34FRt7PlE1QgiB4bKjssrHG9ucD6Xkb1RYPDaamkkeCHcAY
  // 'IJ0JIQ0fDJWIDC1UwqmdAlyvuQO8uWrhYdt0FFJNOUbuPXr0XGugIuUS4qYb'
  // localStorage.getItem('token'),
  // IJ0JIQ0fDJWIDC1UwqmdAlyvuQO8uWrhYdt0FFJNOUbuPXr0XGugIuUS4qYb
  storageRefreshTokenKeyName: 'refreshToken',
};
