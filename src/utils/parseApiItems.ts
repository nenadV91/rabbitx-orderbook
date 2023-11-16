import { ApiItemsType, OrderBookSideType } from "../types";

export const parseApiItems = (input: ApiItemsType): OrderBookSideType => {
  return Object.fromEntries(input);
};
