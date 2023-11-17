import { useMemo } from "react";
import { useOrderbook } from "../../hooks/useOrderbook";
import { orderBookItemLimit } from "../../constants";
import { Heading } from "./Heading";
import { Bids } from "./Bids";
import { Asks } from "./Asks";
import "./styles.scss";

export const OrderBook = () => {
  const baseCoin = "USD";
  const quoteCoin = "SOL";

  const market = `${quoteCoin}-${baseCoin}`;

  const { bids, asks } = useOrderbook(market);

  const displayBids = useMemo(() => bids.slice(0, orderBookItemLimit), [bids]);
  const displayAsks = useMemo(() => asks.slice(-orderBookItemLimit), [asks]);

  return (
    <div className="order-book">
      <Heading baseCoin={baseCoin} quoteCoin={quoteCoin} />
      <Asks bids={displayAsks} />
      <Bids bids={displayBids} />
    </div>
  );
};
