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
import React, { useMemo, useState } from "react";
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
import useLocalStorage from "use-local-storage";
import { TOPUP_WALLET_STORAGE_KEY } from "../constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import useTransferUSDC from "../hooks/useTransferUSDC";
const web3 = require("@solana/web3.js");
const CreateTopupWalletAlert = dynamic(
  () => import("./CreateTopupWalletAlert"),
  {
    ssr: false,
  }
);

const MarketInfo = () => {
  const [preTopupAddr, setPreTopupAddr] = useLocalStorage(
    TOPUP_WALLET_STORAGE_KEY,
    ""
  );
  const wallet = useWallet();
  const { marketPair, timeInterval, queue, setQueue } = useAppProvider();
  const [amount, setAmount] = useState(10);
  const [repeatTimes, setRepeatTimes] = useState(1);
  const selectingInterval = TimeIntervals.find(
    (e) => e.seconds === timeInterval
  );
  const {
    data,
    isLoading: isLoadingMarket,
    refetch,
  } = useParimutuels(marketPair as MarketPairEnum, timeInterval);
  const { mutateAsync, isLoading: isPlacing } = usePlacePosition();
  const { mutateAsync: transfer, isLoading: isTransfering } = useTransferUSDC();
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
    setRepeatTimes(value);
  };

  const topupRepeatWallet = async (side) => {
    await transfer(amount * repeatTimes);
    setQueue([
      ...queue,
      ...Array.from(Array(repeatTimes).keys())?.map(() => {
        return {
          marketPair,
          timeInterval,
          amount: amount,
          side: side,
        };
      }),
    ]);
  };

  const triggerOrder = async () => {
    const _data = await refetch();
    const pop = queue?.[0];
    if (pop) {
      await mutateAsync({
        useTopupWallet: true,
        pariPubkey: _data?.data?.pubkey,
        side: pop.side,
        amount: pop.amount,
      });
      setQueue(queue.slice(1));
    }
  };

  window.triggerOrder = triggerOrder;
  console.log(queue);

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
                  key={`countdown_${data.pubkey}`}
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
                    disabled={preTopupAddr === ""}
                    defaultValue={1}
                    onChange={onChangeRepeatTimes}
                  />
                </div>
                <Divider />
                <div className="w-100 d-flex flex-row gap-3">
                  <Button
                    onClick={async () => {
                      if (repeatTimes > 1) {
                        await topupRepeatWallet(PositionSideEnum.LONG);
                      } else {
                        await mutateAsync({
                          pariPubkey: data?.pubkey,
                          side: PositionSideEnum.LONG,
                          amount: amount,
                        });
                      }
                    }}
                    type="primary"
                    icon={<ArrowUpOutlined />}
                    size="large"
                    loading={isPlacing || isTransfering}
                    style={{ backgroundColor: "green" }}
                    block
                  >
                    Long
                  </Button>
                  <Button
                    onClick={async () => {
                      if (repeatTimes > 1) {
                        await topupRepeatWallet(PositionSideEnum.SHORT);
                      } else {
                        await mutateAsync({
                          pariPubkey: data?.pubkey,
                          side: PositionSideEnum.SHORT,
                          amount: amount,
                        });
                      }
                    }}
                    type="primary"
                    loading={isPlacing || isTransfering}
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
