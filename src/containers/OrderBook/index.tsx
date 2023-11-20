import { useMemo } from "react";
import { useOrderbook } from "../../hooks/useOrderbook";
import { orderBookItemLimit } from "../../constants";
import { calculateTotal } from "../../utils/calculateBarsPercentage";
import { OrderbookHeading } from "../../components/OrderbookHeading";
import { OrderbookBids } from "../../components/OrderbookBids";
import { OrderbookAsks } from "../../components/OrderbookAsks";
import { MarketPrice } from "../../components/MarketPrice";
import "./styles.scss";
import { useMarketPrice } from "../../hooks/useMarketPrice";
import { MarketItem } from "../../types";

type Props = {
  market: MarketItem;
};

export const OrderBook = ({ market }: Props) => {
  const { baseCoin, quoteCoin } = market;
  const marketString = `${quoteCoin}-${baseCoin}`;

  const { bids, asks } = useOrderbook(marketString);

  const displayBids = useMemo(() => bids.slice(0, orderBookItemLimit), [bids]);
  const displayAsks = useMemo(() => asks.slice(-orderBookItemLimit), [asks]);

  const { lastTradedPrice, indexPrice, marketPriceDirection } =
    useMarketPrice(marketString);

  const { askTotals, bidTotals } = calculateTotal(displayAsks, displayBids);

  return (
    <div className="order-book">
      <OrderbookHeading baseCoin={baseCoin} quoteCoin={quoteCoin} />
      <OrderbookAsks totals={askTotals} asks={displayAsks} />
      <MarketPrice
        lastTradedPrice={lastTradedPrice}
        indexPrice={indexPrice}
        marketPriceDirection={marketPriceDirection}
      />
      <OrderbookBids totals={bidTotals} bids={displayBids} />
    </div>
  );
};
