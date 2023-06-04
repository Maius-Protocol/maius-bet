import { Avatar, Button, List, Tag } from "antd";
import { colors } from "../colors";
import { useAppProvider } from "../AppProvider";
import usePositions from "../hooks/usePositions";
import useExpireParimutuel from "../hooks/useExpireParimutuel";
import { PositionSideEnum } from "@hxronetwork/parimutuelsdk";
import OrderHistoryItem from "./OrderHistoryItem";
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
  const { data: parimutuelData } = useExpireParimutuel(
    marketPair,
    timeInterval,
    "4mQfncGgYu1XyZB1WBBi49GTRf7uPyiMuUETDDhVFdp7"
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
        return <OrderHistoryItem item={item}></OrderHistoryItem>;
      }}
    />
  );
};

export default OrderHistory;
