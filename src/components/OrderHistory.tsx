import { Avatar, Button, List, Tag } from "antd";
import { colors } from "../colors";
import { useAppProvider } from "../AppProvider";
import usePositions from "../hooks/usePositions";
import { PositionSideEnum } from "@hxronetwork/parimutuelsdk";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import React from "react";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

const OrderHistory = () => {
  const { marketPair, timeInterval } = useAppProvider();
  const { data: positionsData, isLoading } = usePositions(
    marketPair,
    timeInterval
  );
  return (
    <List
      header="Orders Book"
      itemLayout="horizontal"
      dataSource={positionsData || []}
      bordered
      loading={isLoading}
      style={{ backgroundColor: colors.cardBackground }}
      renderItem={(item, index) => {
        console.log(item);
        const longPosition =
          item?.info?.position?.longPosition?.toNumber() / 1_000_000_000;
        const shortPosition =
          item?.info?.position?.shortPosition?.toNumber() / 1_000_000_000;
        const side =
          longPosition === 0 ? PositionSideEnum.SHORT : PositionSideEnum.LONG;
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
                side === PositionSideEnum.SHORT ? (
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
                )
              }
              title={
                <a href="https://ant.design">
                  {item.info.parimutuelPubkey?.toBase58()}
                </a>
              }
              description={
                <div className="mt-2">
                  <Tag color={item?.info?.position?.paid ? "green" : "red"}>
                    {item?.info?.position?.paid ? "PAID" : "UNPAID"}
                  </Tag>
                  {/*  <p>{item?.info?.position?.payout?.toNumber()}</p>*/}
                  {/*<p>{item?.info?.position?.numEntries?.toNumber()}</p>*/}
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default OrderHistory;
