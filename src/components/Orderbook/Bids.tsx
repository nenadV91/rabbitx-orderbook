import { BarLengths } from "../../hooks/calculateBarsPercentage";
import { BidAskType } from "../../types";
import { calculateTotalAmount } from "../../utils/calculateTotalAmount";

type Props = {
  bids: BidAskType;
  percentages: BarLengths;
};

export const Bids = ({ bids, percentages }: Props) => {
  return (
    <div className="bids">
      {bids.map(([price, amount]) => (
        <div key={price} className="bids-row">
          <span className="text-success">{price}</span>
          <span>{amount}</span>
          <span
            style={{ ["--width-after" as string]: `${percentages[price]}%` }}
            className="percentage-bar bids-bar"
          >
            {calculateTotalAmount(price, amount)}
          </span>
        </div>
      ))}
    </div>
  );
};
