import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { OrderBook } from "../../containers/OrderBook";

function App() {
  return (
    <Container className="text-secondary">
      <Row className="center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <OrderBook />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
