import { OrderSideType } from "../../types";
import { calculateTotalAmount } from "../../utils/calculateTotalAmount";
import "./styles.scss";

type Props = {
  price: string;
  amount: string;
  percentage: number;
  type: OrderSideType;
};

export const OrderbookPercentageBar = ({
  percentage,
  amount,
  price,
  type,
}: Props) => {
  const barType = type === OrderSideType.ASK ? "asks-bar" : "bids-bar";
  const style = { ["--width-after" as string]: `${percentage}%` };

  return (
    <span style={style} className={`percentage-bar ${barType}`}>
      {calculateTotalAmount(price, amount)}
    </span>
  );
};
