import { Badge } from "react-bootstrap";

type HeadCellProps = {
  label: string;
  badge: string;
};

export const HeadingItem = ({ label, badge }: HeadCellProps) => {
  return (
    <div className="heading-item">
      <span>{label}</span>
      <Badge className="bg-secondary">{badge}</Badge>
    </div>
  );
};
