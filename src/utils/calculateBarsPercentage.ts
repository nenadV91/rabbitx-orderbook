import { BidAskType } from "../types";

export type BarLengths = {
  [key: string]: number;
};

export type BarLengthsOutput = {
  askPercentages: BarLengths;
  bidPercentages: BarLengths;
};

export function calculateBarLengths(
  asks: BidAskType,
  bids: BidAskType
): BarLengthsOutput {
  if (!bids.length || !asks.length) {
    return { askPercentages: {}, bidPercentages: {} };
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
      acc[price] = percentage;
      return acc;
    }, {} as BarLengths);
  };

  const askPercentages = calculatePercentages(cumulativeAsks);
  const bidPercentages = calculatePercentages(cumulativeBids);

  return { askPercentages, bidPercentages };
}
