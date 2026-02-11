import React from "react";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import Card from "react-bootstrap/Card";
import imgDoctor from "../assets/doctors/1.png";
import "./CardDoctor.scss";

function BasicExample({ imageUrl, name, position, id }) {
    const history = useHistory();

    const handleViewDetail = () => {
        history.push(`/get-detail-doctor-by-id/${id}`);
    };
    return (
        <Card>
            <Card.Img
                variant="top"
                src={imageUrl}
                className="doctor-image"
                onError={(e) => {
                    e.target.src = "/default-doctor.png";
                }}
            />
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>
                    <p>Chức Vụ: {position}</p>
                    <p>Chuyên Khoa: Thần Kinh</p>
                </Card.Text>
                <Button variant="primary" onClick={handleViewDetail}>Go somewhere</Button>
            </Card.Body>
        </Card>
    );
}

export default BasicExample;
