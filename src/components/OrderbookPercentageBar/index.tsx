import { orderBookDecimalLimit } from "../../constants";
import { OrderSideType } from "../../types";
import { limitDecimals } from "../../utils/limitDecimals";
import "./styles.scss";

type Props = {
  price: string;
  amount: string;
  total: {
    percentage: number;
    cumulative: number | string;
  };
  type: OrderSideType;
};

export const OrderbookPercentageBar = ({
  total: { percentage, cumulative },
  type,
}: Props) => {
  const barType = type === OrderSideType.ASK ? "asks-bar" : "bids-bar";
  const style = { ["--width-after" as string]: `${percentage}%` };

  return (
    <span style={style} className={`percentage-bar ${barType}`}>
      {limitDecimals(+cumulative, orderBookDecimalLimit)}
    </span>
  );
};
