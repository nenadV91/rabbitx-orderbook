import { BidAskType } from "../types";

export const updateOrderBookItems = (
  currentItems: BidAskType,
  newItems: BidAskType | null
): BidAskType => {
  let output = currentItems;

  // If there are new items for update
  if (newItems && newItems.length) {
    // Turn array into object for faster lookup
    const data = Object.fromEntries(output);

    // Replace or add new items or delete if amount is zero
    newItems.forEach(([price, amount]) => {
      if (+amount) data[price] = amount;
      else delete data[price];
    });

    // Turn back into an array
    output = Object.entries(data);
  }

  // Sort by price
  output.sort((a, b) => +b[0] - +a[0]);

  return output;
};
