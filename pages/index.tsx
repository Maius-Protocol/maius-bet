import { Card, Col, Divider, Row, Statistic } from "antd";
import React from "react";
import MarketInfo from "@components/MarketInfo";
import {
  WalletConnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import OrderHistory from "@components/OrderHistory";
import dynamic from "next/dynamic";
const HeaderAccount = dynamic(() => import("../src/components/HeaderAccount"), {
  ssr: false,
});

export default function Index() {
  return (
    <div className="d-flex flex-column">
      <div className="p-3 d-flex flex-row align-items-center justify-content-between">
        {typeof window !== "undefined" && <HeaderAccount />}
      </div>
      <Divider style={{ marginTop: 0 }} />
      <div
        className="binance-widget-marquee"
        data-cmc-ids="1,3408,5426,1027"
        data-theme="dark"
        data-transparent="true"
        data-locale="en"
        data-powered-by="Powered by"
      ></div>
      <Divider />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="center">
        <Col className="gutter-row" span={11}>
          <div className="p-3 pt-0">
            <MarketInfo />
          </div>
        </Col>
        <Col span={1}>
          <Divider type="vertical" style={{ height: "100vh", marginLeft: 0 }} />
        </Col>
        <Col className="gutter-row" span={11}>
          <div className="pr-3">
            <OrderHistory />
          </div>
        </Col>
      </Row>
    </div>
  );
}

Index.noLayout = true;
