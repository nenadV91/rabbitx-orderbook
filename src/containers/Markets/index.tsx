import { ListGroup, ListGroupItem } from "react-bootstrap";
import { markets } from "../../constants";
import "./styles.scss";
import { MarketItem } from "../../types";

type Props = {
  market: MarketItem;
  onMarketChange: (newMarket: MarketItem) => void;
};

export const Markets = ({ market, onMarketChange }: Props) => {
  return (
    <div className="markets">
      <div className="markets-title">
        <span>Markets</span>
        <span>
          {market.quoteCoin}-{market.baseCoin}
        </span>
      </div>

      <ListGroup className="market-list">
        {markets.map(({ id, baseCoin, quoteCoin }) => (
          <ListGroupItem
            action
            className="market-item"
            onClick={() => onMarketChange({ id, baseCoin, quoteCoin })}
            key={id}
          >
            {quoteCoin}-{baseCoin}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};
