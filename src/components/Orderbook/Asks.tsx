import { BarLengths } from "../../hooks/calculateBarsPercentage";
import { BidAskType } from "../../types";
import { calculateTotalAmount } from "../../utils/calculateTotalAmount";

type Props = {
  asks: BidAskType;
  percentages: BarLengths;
};

export const Asks = ({ asks, percentages }: Props) => {
  return (
    <div className="asks">
      {asks.map(([price, amount]) => (
        <div key={price} className="asks-row">
          <span className="text-danger">{price}</span>
          <span>{amount}</span>
          <span
            style={{ ["--width-after" as string]: `${percentages[price]}%` }}
            className="percentage-bar asks-bar"
          >
            {calculateTotalAmount(price, amount)}
          </span>
        </div>
      ))}
    </div>
  );
};
