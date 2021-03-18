import { findByLabelText } from "@testing-library/dom";
import React from "react";
import { Card, Image, Row } from "react-bootstrap";

const newsItemStyle = {
  width: "60vw",
  height: "auto",
  margin: "20px",
}

const imageStyle = {
  display: "block",
  height: "auto",
  width: "20vw"
}

export interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

const NewsCard: React.FC<NewsItem> = (props) => {
  const { category, datetime, headline, id, image, related, source, summary, url } = props;

  return (
    <Row className="justify-content-center mt-2">
      <a href={url}>
        <Card style={newsItemStyle}>
          <Card.Header>{headline}</Card.Header>
          <Image className="mx-auto" src={image} style={imageStyle}/>
          <Card.Body>
            <Card.Title>{source}</Card.Title>
            <Card.Text>{summary}</Card.Text>
          </Card.Body>
        </Card>
      </a>
    </Row> 
  )
}

export default NewsCard;