import { ApiItemsType, OrderBookSideType } from "../types";
import { parseApiItems } from "./parseApiItems";

export const updateOrderBookSide = (
  currentItems: OrderBookSideType,
  newItems: ApiItemsType
): OrderBookSideType => {
  // Merge current bid/ask state with new items from the API
  const output: OrderBookSideType = {
    ...currentItems,
    ...parseApiItems(newItems),
  };

  // Clear out the empty bids
  for (const key in output) {
    if (!Number(output[key])) {
      delete output[key];
    }
  }

  return output;
};
