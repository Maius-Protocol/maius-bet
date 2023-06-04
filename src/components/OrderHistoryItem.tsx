import { Avatar, Button, List, Tag } from "antd";
import { useAppProvider } from "../AppProvider";
import useExpireParimutuel from "../hooks/useExpireParimutuel";
import { PositionSideEnum } from "@hxronetwork/parimutuelsdk";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { addMinutes, differenceInSeconds, fromUnixTime } from "date-fns";
import type { CountdownProps } from "antd";
import { Col, Row, Statistic } from "antd";

const { Countdown } = Statistic;

const OrderHistoryItem = ({ item }) => {
  const { marketPair, timeInterval } = useAppProvider();
  const { data: parimutuelData, isLoading } = useExpireParimutuel(
    marketPair,
    timeInterval,
    item.info.parimutuelPubkey?.toBase58()
  );
  const longPosition =
    item?.info?.position?.longPosition?.toNumber() / 1_00_000_000;
  const shortPosition =
    item?.info?.position?.shortPosition?.toNumber() / 1_00_000_000;
  const side =
    longPosition === 0 ? PositionSideEnum.SHORT : PositionSideEnum.LONG;
  let deadline = addMinutes(
    fromUnixTime(parimutuelData?.timeWindowStart! / 1000),
    timeInterval / 60
  ).getTime();

  return (
    <List.Item
      actions={
        <>
          <Button
            type="primary"
            icon={<ArrowUpOutlined />}
            style={{ backgroundColor: "green" }}
          >
            Long
          </Button>
        </>
      }
    >
      <List.Item.Meta
        avatar={
          <div className="d-flex flex-column">
            {side === PositionSideEnum.SHORT ? (
              <Button
                type="primary"
                icon={<ArrowDownOutlined />}
                style={{ backgroundColor: "red" }}
              >
                Short
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<ArrowUpOutlined />}
                style={{ backgroundColor: "green" }}
              >
                Long
              </Button>
            )}
            <Tag
              bordered
              style={{
                padding: "6px",
                marginTop: "8px",
                width: "100%",
                textAlign: "center",
              }}
              color={item?.info?.position?.paid ? "green" : "red"}
            >
              {item?.info?.position?.paid ? "PAID" : "UNPAID"}
            </Tag>
          </div>
        }
        title={
          <a
            target="_blank"
            href={`https://solana.fm/address/${item.info.parimutuelPubkey?.toBase58()}?cluster=devnet-solana`}
          >
            {item.info.parimutuelPubkey?.toBase58()}
          </a>
        }
        description={
          <div className="mt-2">
            <Row gutter={16}>
              <Col span={12}>
                <Countdown title="Count down" value={deadline} />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Result"
                  value={
                    parimutuelData?.expired
                      ? (parimutuelData?.strike! < parimutuelData?.index! &&
                          side === PositionSideEnum.LONG) ||
                        (parimutuelData?.strike! > parimutuelData?.index! &&
                          side === PositionSideEnum.SHORT)
                        ? "🎉 Win"
                        : "😭 Lose"
                      : "Pending"
                  }
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Locked price"
                  value={parimutuelData?.strike! ? parimutuelData?.strike : 0}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Expired price"
                  value={parimutuelData?.index! ? parimutuelData?.index : 0}
                />
              </Col>
            </Row>
          </div>
        }
      />
    </List.Item>
  );
};

export default OrderHistoryItem;
