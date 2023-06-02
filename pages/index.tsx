import { Card, Col, Row } from "antd";
import React from "react";
import { colors } from "../src/colors";

export default function Index() {
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col className="gutter-row" span={12}>
        <div style={{ color: "white" }}>col-6</div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div style={{ color: "white" }}>col-6</div>
      </Col>
    </Row>
  );
}

Index.noLayout = true;
