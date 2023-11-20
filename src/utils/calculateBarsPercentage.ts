import { BidAskType } from "../types";

export type TotalItem = {
  [key: string]: {
    percentage: number;
    cumulative: number | string;
  };
};

export type Total = {
  askTotals: TotalItem;
  bidTotals: TotalItem;
};

export function calculateTotal(asks: BidAskType, bids: BidAskType): Total {
  if (!bids.length || !asks.length) {
    return { askTotals: {}, bidTotals: {} };
  }

  // Helper function to calculate cumulative amounts
  const calculateCumulative = (arr: BidAskType) => {
    let cumulative = 0;
    return arr.map(([price, amount]) => [price, (cumulative += +amount)]);
  };

  // Calculating cumulative amounts, and we reverse asks
  const cumulativeAsks = calculateCumulative([...asks].reverse());
  const cumulativeBids = calculateCumulative(bids);

  // Find the maximum cumulative amount
  const maxCumulative = Math.max(
    +cumulativeAsks[cumulativeAsks.length - 1][1],
    +cumulativeBids[cumulativeBids.length - 1][1]
  );

  // Calculate the bar lengths as percentages
  const calculatePercentages = (arr: (string | number)[][]) => {
    return arr.reduce((acc, [price, cumulative]) => {
      const percentage = (+cumulative / maxCumulative) * 100;
      acc[price] = { percentage, cumulative };
      return acc;
    }, {} as TotalItem);
  };

  const askTotals = calculatePercentages(cumulativeAsks);
  const bidTotals = calculatePercentages(cumulativeBids);

  return { askTotals, bidTotals };
}
