import { limitDecimals } from "./limitDecimals";
import { orderBookDecimalLimit } from "../constants";

export const calculateTotalAmount = (price: string, amount: string) => {
  return limitDecimals(+price * +amount, orderBookDecimalLimit);
};
