import { MarketItem } from "./types";

// Env variables
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
export const orderBookItemLimit = 11;
export const orderBookDecimalLimit = 3;

// Markets
export const markets: MarketItem[] = [
  {
    id: 1,
    baseCoin: "USD",
    quoteCoin: "BTC",
  },
  {
    id: 2,
    baseCoin: "USD",
    quoteCoin: "ETH",
  },
  {
    id: 3,
    baseCoin: "USD",
    quoteCoin: "SOL",
  },
  {
    id: 4,
    baseCoin: "USD",
    quoteCoin: "ARB",
  },
  {
    id: 5,
    baseCoin: "USD",
    quoteCoin: "DOGE",
  },
  {
    id: 6,
    baseCoin: "USD",
    quoteCoin: "LDO",
  },
  {
    id: 7,
    baseCoin: "USD",
    quoteCoin: "SUI",
  },
  {
    id: 8,
    baseCoin: "USD",
    quoteCoin: "BCH",
  },
  {
    id: 9,
    baseCoin: "USD",
    quoteCoin: "XRP",
  },
  {
    id: 10,
    baseCoin: "USD",
    quoteCoin: "WLD",
  },
];
