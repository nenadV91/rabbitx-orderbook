import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { MarketItem } from "../../types";
import { Container, Row, Col } from "react-bootstrap";
import { OrderBook } from "../../containers/OrderBook";
import { Markets } from "../../containers/Markets";
import { markets } from "../../constants";

function App() {
  const [market, setMarket] = useState<MarketItem>(markets[0]);

  const onMarketChange = (newMarket: MarketItem) => {
    setMarket(newMarket);
  };

  return (
    <Container className="text-secondary">
      <Row className="center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <OrderBook market={market} />
        </Col>

        <Col xs={12} md={4} lg={4} xl={4}>
          <Markets onMarketChange={onMarketChange} market={market} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
