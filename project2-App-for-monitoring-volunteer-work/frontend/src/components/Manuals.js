
import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo rằng bạn đã cài đặt và import Bootstrap CSS

const CardComponent = () => {
  return (
    <div className="container">
      <Card className="float-left">
        <Row>
          <Col sm={7}>
            <Card.Body>
              {/* <Card.Title>Small card</Card.Title> */}
              <Card.Text>
                <h3>Trị bệnh sốt rét.</h3>
              </Card.Text>
              <Card.Text>
                Change around the content for awesomeness
              </Card.Text>
              <Button variant="primary" size="sm">Read More</Button>
            </Card.Body>
          </Col>
          <Col sm={5}>
            <Card.Img variant="top" src="https://picsum.photos/150?image=380" alt="Image Title" />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default CardComponent;
