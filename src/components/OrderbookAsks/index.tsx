import { BarLengths } from "../../hooks/calculateBarsPercentage";
import { BidAskType, OrderSideType } from "../../types";
import { OrderbookPercentageBar } from "../OrderbookPercentageBar";
import "./styles.scss";

type Props = {
  asks: BidAskType;
  percentages: BarLengths;
};

export const OrderbookAsks = ({ asks, percentages }: Props) => {
  return (
    <div className="asks">
      {asks.map(([price, amount]) => (
        <div key={price} className="asks-row">
          <span className="text-danger">{price}</span>
          <span>{amount}</span>
          <OrderbookPercentageBar
            type={OrderSideType.ASK}
            percentage={percentages[price]}
            price={price}
            amount={amount}
          />
        </div>
      ))}
    </div>
  );
};
