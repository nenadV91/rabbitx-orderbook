import { BidAskType } from "../../types";
import { calculateTotalAmount } from "../../utils/calculateTotalAmount";

type Props = {
  bids: BidAskType;
};

export const Bids = ({ bids }: Props) => {
  return (
    <div className="bids">
      {bids.map(([price, amount]) => (
        <div className="bids-row">
          <span className="text-success">{price}</span>
          <span>{amount}</span>
          <span>{calculateTotalAmount(price, amount)}</span>
        </div>
      ))}
    </div>
  );
};
