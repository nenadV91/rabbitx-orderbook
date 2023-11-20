import { TotalItem } from "../../utils/calculateBarsPercentage";
import { BidAskType, OrderSideType } from "../../types";
import { OrderbookPercentageBar } from "../OrderbookPercentageBar";
import "./styles.scss";

type Props = {
  bids: BidAskType;
  totals: TotalItem;
};

export const OrderbookBids = ({ bids, totals }: Props) => {
  return (
    <div className="bids">
      {bids.map(([price, amount]) => (
        <div key={price} className="bids-row">
          <span className="text-success">{price}</span>
          <span>{amount}</span>
          <OrderbookPercentageBar
            type={OrderSideType.BID}
            total={totals[price]}
            price={price}
            amount={amount}
          />
        </div>
      ))}
    </div>
  );
};
