import React from "react";

import {
          Container,
          Table,
          Row,
          Col
        } from "react-bootstrap";

export interface fundamentalDataT {
    company_name: string;
    exchange: string;
    currency: string;
    year_high: number;
    year_low: number;
    market_cap: number;
    beta: number;
    pe_ratio: number;
    eps: number;
    dividend_yield: number;
}

export const defaultFundamentalData = {
  company_name: "",
  exchange: "",
  currency: "",
  year_high: 0,
  year_low: 0,
  market_cap: 0,
  beta: 0,
  pe_ratio: 0,
  eps: 0,
  dividend_yield: 0,
}

interface Props {
  fundamentalData: fundamentalDataT;
}

var formatMap = {
  stockname: {name: "Company Name"},
  exchange: {name: "Exchange"},
  currency: {name: "Currency"},
  yearlylow: {name: "Year Low"},
  yearlyhigh: {name: "Year High"},
  marketcap: {name: "Market Capitalisation"},
  beta: {name: "Beta"},
  peratio: {name: "PE Ratio"},
  eps: {name: "EPS"},
  dividendyield: {name: "Dividend Yield"},
};

const DataFundamentals: React.FC<Props> = (props) => {
  var { fundamentalData } = props;
  return (
    <Container>
    <Row>
      <Col>
        <hr />
        {Object.entries(fundamentalData).map(([field, value]) => (
          <div>
            <Row lg={6}>
              <Col className="text-left" lg={6}>
                <span>
                  <b>{formatMap[field] ? formatMap[field].name : field}</b>
                </span>
              </Col>
              <Col className="text-right" lg={6}>
                <span>
                  {value}
                </span>
              </Col>
            </Row>
            <hr />
          </div>
        ))}
      </Col>
    </Row>
    </Container>
  );
}

export default DataFundamentals;