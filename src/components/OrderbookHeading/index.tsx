import { HeadingItem } from "./HeadingItem";
import "./styles.scss";

type Props = {
  baseCoin: string;
  quoteCoin: string;
};

export const OrderbookHeading = ({ baseCoin, quoteCoin }: Props) => {
  return (
    <div className="heading">
      <HeadingItem label="Price" badge={baseCoin} />
      <HeadingItem label="Amount" badge={quoteCoin} />
      <HeadingItem label="Total" badge={quoteCoin} />
    </div>
  );
};
