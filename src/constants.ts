const {
  VITE_TEST_JWT_TOKEN,
  VITE_TEST_WS_URL,
  VITE_PROD_JWT_TOKEN,
  VITE_PROD_WS_URL,
  VITE_IS_PRODUCTION,
} = import.meta.env;

export const isProd = VITE_IS_PRODUCTION || false;
export const jwtToken = isProd ? VITE_PROD_JWT_TOKEN : VITE_TEST_JWT_TOKEN;
export const wsUrl = isProd ? VITE_PROD_WS_URL : VITE_TEST_WS_URL;

// OrderBook
export const orderBookItemLimit = 10;
export const orderBookDecimalLimit = 4;
