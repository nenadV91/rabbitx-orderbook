import { useOrderbook } from "../../hooks/useOrderbook";

export const OrderBook = () => {
  const market = "SOL-USD";

  const { bids, asks } = useOrderbook(market);

  console.log("bids", bids);
  console.log("asks", asks);

  return <div>OrderBook</div>;
};
