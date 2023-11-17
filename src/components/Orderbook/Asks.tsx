import { BidAskType } from "../../types";
import { calculateTotalAmount } from "../../utils/calculateTotalAmount";

type Props = {
  bids: BidAskType;
};

export const Asks = ({ bids }: Props) => {
  return (
    <div className="asks">
      {bids.map(([price, amount]) => (
        <div key={price} className="asks-row">
          <span className="text-danger">{price}</span>
          <span>{amount}</span>
          <span>{calculateTotalAmount(price, amount)}</span>
        </div>
      ))}
    </div>
  );
};
