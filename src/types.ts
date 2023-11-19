// Items type of bid/ask as returned from the API
export type BidAskType = [string, string][];

// Enum for Bid/Aks
export enum OrderSideType {
  BID = "BID",
  ASK = "ASK",
}

export type MarketItem = {
  id: number;
  baseCoin: string;
  quoteCoin: string;
};

export enum MarketPriceDirection {
  UP = "UP",
  DOWN = "DOWN",
}
