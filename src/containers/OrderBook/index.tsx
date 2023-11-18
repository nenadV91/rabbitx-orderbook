import { useMemo } from "react";
import { useOrderbook } from "../../hooks/useOrderbook";
import { orderBookItemLimit } from "../../constants";
import { calculateBarLengths } from "../../hooks/calculateBarsPercentage";
import { OrderbookHeading } from "../../components/OrderbookHeading";
import { OrderbookBids } from "../../components/OrderbookBids";
import { OrderbookAsks } from "../../components/OrderbookAsks";
import "./styles.scss";

export const OrderBook = () => {
  const baseCoin = "USD";
  const quoteCoin = "SOL";

  const market = `${quoteCoin}-${baseCoin}`;

  const { bids, asks } = useOrderbook(market);

  const displayBids = useMemo(() => bids.slice(0, orderBookItemLimit), [bids]);
  const displayAsks = useMemo(() => asks.slice(-orderBookItemLimit), [asks]);

  const { askPercentages, bidPercentages } = calculateBarLengths(
    displayAsks,
    displayBids
  );

  return (
    <div className="order-book">
      <OrderbookHeading baseCoin={baseCoin} quoteCoin={quoteCoin} />
      <OrderbookAsks percentages={askPercentages} asks={displayAsks} />
      <OrderbookBids percentages={bidPercentages} bids={displayBids} />
    </div>
  );
};
