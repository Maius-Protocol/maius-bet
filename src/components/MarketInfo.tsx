import {
  Button,
  Card,
  Divider,
  InputNumber,
  Result,
  Segmented,
  Space,
} from "antd";
import { MarketPairEnum, PositionSideEnum } from "@hxronetwork/parimutuelsdk";
import React, { useState } from "react";
import useMarkets from "../hooks/useMarkets";
import useParimutuels from "../hooks/useParimutuels";
import CountdownComponent from "@components/Countdown";
import { differenceInSeconds, fromUnixTime } from "date-fns";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import usePlacePosition from "../hooks/usePlacePosition";
import { colors } from "../colors";
import MarketOptions from "@components/MarketOptions";
import { TimeIntervals, useAppProvider } from "../AppProvider";
import dynamic from "next/dynamic";

const CreateTopupWalletAlert = dynamic(
  () => import("./CreateTopupWalletAlert"),
  {
    ssr: false,
  }
);

const MarketInfo = () => {
  const { marketPair, timeInterval } = useAppProvider();
  const [amount, setAmount] = useState(10);
  const [repeatTimes, setRepeatTimes] = useState(1);
  const selectingInterval = TimeIntervals.find(
    (e) => e.seconds === timeInterval
  );
  const { data, isLoading: isLoadingMarket } = useParimutuels(
    marketPair as MarketPairEnum,
    timeInterval
  );
  const { mutateAsync, isLoading: isPlacing } = usePlacePosition();

  const isLoading = isLoadingMarket;
  const currentTime = new Date().getTime();
  const timeDiff = data?.locksTime
    ? differenceInSeconds(fromUnixTime(data?.locksTime / 1000), currentTime)
    : 0;

  const onChange = (value: number) => {
    console.log("changed", value);
    setAmount(value);
  };
  const onChangeRepeatTimes = (value: number) => {
    console.log("changed", value);
    setAmount(value);
  };

  return (
    <>
      <div className="mb-4">
        <CreateTopupWalletAlert />
      </div>

      <div
        className="d-flex flex-column align-items-center justify-content-center py-2"
        style={{ backgroundColor: colors.cardBackground, borderRadius: "8px" }}
      >
        <MarketOptions />
      </div>
      <div style={{ color: "white", marginTop: "24px" }}>
        <Card
          loading={isLoading}
          title={`${marketPair} - ${selectingInterval?.title}`}
          bordered
          style={{ width: "100%", backgroundColor: colors.cardBackground }}
        >
          <div className="d-flex flex-column align-items-center">
            {!data && (
              <Result
                status="warning"
                title="There are some problems with your operation."
              />
            )}
            {data && (
              <>
                <CountdownComponent
                  seconds={timeDiff}
                  total={selectingInterval?.seconds}
                  data={data}
                />
                <div className="mb-2 w-100">
                  <div className="mb-2">
                    <b>Amount</b>
                  </div>
                  <InputNumber
                    size="large"
                    addonAfter="USDC"
                    min={1}
                    max={100000}
                    defaultValue={10}
                    onChange={onChange}
                  />
                </div>
                <div className="mt-2 w-100">
                  <div className="mb-2">
                    <b>Repeat</b>
                  </div>
                  <InputNumber
                    size="large"
                    addonAfter="times"
                    min={1}
                    max={60}
                    defaultValue={1}
                    onChange={onChangeRepeatTimes}
                  />
                </div>
                <Divider />
                <div className="w-100 d-flex flex-row gap-3">
                  <Button
                    onClick={() => {
                      mutateAsync({
                        pariPubkey: data?.pubkey,
                        side: PositionSideEnum.LONG,
                        amount: amount,
                      }).then();
                    }}
                    type="primary"
                    icon={<ArrowUpOutlined />}
                    size="large"
                    loading={isPlacing}
                    style={{ backgroundColor: "green" }}
                    block
                  >
                    Long
                  </Button>
                  <Button
                    onClick={() => {
                      mutateAsync({
                        pariPubkey: data?.pubkey,
                        side: PositionSideEnum.SHORT,
                        amount: amount,
                      }).then();
                    }}
                    type="primary"
                    loading={isPlacing}
                    icon={<ArrowDownOutlined />}
                    size="large"
                    style={{ backgroundColor: "red" }}
                    block
                  >
                    Short
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default MarketInfo;
