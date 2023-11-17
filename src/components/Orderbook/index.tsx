import { useMemo } from "react";
import { useOrderbook } from "../../hooks/useOrderbook";
import { Table, Badge } from "react-bootstrap";
import { OrderSideType } from "../../types";
import { orderBookDecimalLimit, orderBookItemLimit } from "../../constants";
import "./styles.scss";
import { limitDecimals } from "../../utils/limitDecimals";

type HeadCellProps = {
  label: string;
  badge: string;
};

const HeadCell = ({ label, badge }: HeadCellProps) => {
  return (
    <th>
      <span>{label}</span>
      <Badge className="bg-secondary">{badge}</Badge>
    </th>
  );
};

type RowProps = {
  price: string;
  amount: string;
  type: OrderSideType;
};

const Row = ({ price, amount, type }: RowProps) => {
  const priceColor =
    type === OrderSideType.ASK ? "text-danger" : "text-success";

  const total = limitDecimals(
    Number(price) * Number(amount),
    orderBookDecimalLimit
  );

  return (
    <tr>
      <td className={priceColor}>{price}</td>
      <td>{amount}</td>
      <td>{total}</td>
    </tr>
  );
};

export const OrderBook = () => {
  const baseCoin = "USD";
  const quoteCoin = "SOL";

  const market = `${quoteCoin}-${baseCoin}`;

  const { bids, asks } = useOrderbook(market);

  const displayBids = useMemo(() => bids.slice(0, orderBookItemLimit), [bids]);
  const displayAsks = useMemo(() => asks.slice(-orderBookItemLimit), [asks]);

  return (
    <div>
      <Table className="order-book-table">
        <thead>
          <tr>
            <HeadCell label="Price" badge={baseCoin} />
            <HeadCell label="Amount" badge={quoteCoin} />
            <HeadCell label="Total" badge={quoteCoin} />
          </tr>
        </thead>

        <tbody>
          {displayAsks.map(([price, amount]) => (
            <Row
              key={price}
              price={price}
              amount={amount}
              type={OrderSideType.ASK}
            />
          ))}
        </tbody>

        <tbody>
          {displayBids.map(([price, amount]) => (
            <Row
              key={price}
              price={price}
              amount={amount}
              type={OrderSideType.BID}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};
