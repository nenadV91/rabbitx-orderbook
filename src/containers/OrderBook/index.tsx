import { useMemo } from "react";
import { useOrderbook } from "../../hooks/useOrderbook";
import { orderBookItemLimit } from "../../constants";
import { calculateBarLengths } from "../../utils/calculateBarsPercentage";
import { OrderbookHeading } from "../../components/OrderbookHeading";
import { OrderbookBids } from "../../components/OrderbookBids";
import { OrderbookAsks } from "../../components/OrderbookAsks";
import { MarketPrice } from "../../components/MarketPrice";
import "./styles.scss";
import { useMarketPrice } from "../../hooks/useMarketPrice";

export const OrderBook = () => {
  const baseCoin = "USD";
  const quoteCoin = "SOL";

  const market = `${quoteCoin}-${baseCoin}`;

  const { bids, asks } = useOrderbook(market);

  const displayBids = useMemo(() => bids.slice(0, orderBookItemLimit), [bids]);
  const displayAsks = useMemo(() => asks.slice(-orderBookItemLimit), [asks]);

  const { lastTradedPrice, indexPrice, marketPriceDirection } =
    useMarketPrice(market);

  const { askPercentages, bidPercentages } = calculateBarLengths(
    displayAsks,
    displayBids
  );

  return (
    <div className="order-book">
      <OrderbookHeading baseCoin={baseCoin} quoteCoin={quoteCoin} />
      <OrderbookAsks percentages={askPercentages} asks={displayAsks} />
      <MarketPrice
        lastTradedPrice={lastTradedPrice}
        indexPrice={indexPrice}
        marketPriceDirection={marketPriceDirection}
      />
      <OrderbookBids percentages={bidPercentages} bids={displayBids} />
    </div>
  );
};
