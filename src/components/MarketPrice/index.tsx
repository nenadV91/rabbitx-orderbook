import { MarketPriceDirection } from "../../hooks/useMarketPrice";
import MarketUpIcon from "../../assets/icons/market-up.svg";
import MarketDownIcon from "../../assets/icons/market-down.svg";
import "./styles.scss";

type Props = {
  lastTradedPrice: string | null;
  indexPrice: string | null;
  marketPriceDirection: MarketPriceDirection | null;
};

export const MarketPrice = ({
  lastTradedPrice,
  indexPrice,
  marketPriceDirection,
}: Props) => {
  if (!lastTradedPrice || !indexPrice) {
    return null;
  }

  const priceDirectionClass =
    marketPriceDirection === MarketPriceDirection.UP
      ? "text-success"
      : "text-danger";

  const marketIcon =
    marketPriceDirection === MarketPriceDirection.UP
      ? MarketUpIcon
      : MarketDownIcon;

  return (
    <div className="market-price">
      <div
        title="Last traded price"
        className={`last-traded-price ${priceDirectionClass}`}
      >
        <img className="last-traded-price-icon" src={marketIcon} />
        <span className="last-traded-price-value">{lastTradedPrice}</span>
      </div>

      <span title="Underlying spot market price" className="index-price">
        {indexPrice}
      </span>
    </div>
  );
};
