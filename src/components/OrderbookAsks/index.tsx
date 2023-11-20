import { TotalItem } from "../../utils/calculateBarsPercentage";
import { BidAskType, OrderSideType } from "../../types";
import { OrderbookPercentageBar } from "../OrderbookPercentageBar";
import "./styles.scss";

type Props = {
  asks: BidAskType;
  totals: TotalItem;
};

export const OrderbookAsks = ({ asks, totals }: Props) => {
  return (
    <div className="asks">
      {asks.map(([price, amount]) => (
        <div key={price} className="asks-row">
          <span className="text-danger">{price}</span>
          <span>{amount}</span>
          <OrderbookPercentageBar
            type={OrderSideType.ASK}
            total={totals[price]}
            price={price}
            amount={amount}
          />
        </div>
      ))}
    </div>
  );
};
