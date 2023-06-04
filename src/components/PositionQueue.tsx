import { useAppProvider } from "../AppProvider";
import { UnmountClosed } from "react-collapse";
import { Card, Table } from "antd";
import { colors } from "../colors";
import { PositionSideEnum } from "@hxronetwork/parimutuelsdk";

const PositionQueue = () => {
  const { queue, setQueue } = useAppProvider();

  const columns = [
    {
      title: "Pair",
      dataIndex: "marketPair",
      key: "marketPair",
    },
    {
      title: "Time Interval",
      dataIndex: "timeInterval",
      key: "timeInterval",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Side",
      dataIndex: "side",
      key: "side",
      render: (record) => {
        return record === PositionSideEnum.SHORT ? "Short" : "Long";
      },
    },
  ];
  const triggerOrder = () => {};

  window.triggerOrder = triggerOrder;
  console.log(queue);

  return (
    <UnmountClosed isOpened={queue?.length !== 0}>
      <Card
        title="Orders Queue"
        style={{ marginBottom: "24px", backgroundColor: colors.cardBackground }}
      >
        <Table
          dataSource={queue}
          columns={columns}
          bordered={false}
          style={{ backgroundColor: "transparent" }}
        />
      </Card>
    </UnmountClosed>
  );
};

export default PositionQueue;
