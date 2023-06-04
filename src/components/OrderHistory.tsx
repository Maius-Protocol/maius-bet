import { Avatar, Button, List, Tag } from "antd";
import { colors } from "../colors";
import { useAppProvider } from "../AppProvider";
import usePositions from "../hooks/usePositions";
import OrderHistoryItem from "./OrderHistoryItem";
import React from "react";

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
        return <OrderHistoryItem item={item}></OrderHistoryItem>;
      }}
    />
  );
};

export default OrderHistory;
