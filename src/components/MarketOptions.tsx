import { Segmented } from "antd";
import { MarketPairEnum } from "@hxronetwork/parimutuelsdk";
import React from "react";
import { TimeIntervals, useAppProvider } from "../AppProvider";

const MarketOptions = () => {
  const { marketPair, setMarketPair, timeInterval, setTimeInterval } =
    useAppProvider();
  return (
    <>
      <Segmented
        size="large"
        options={[
          MarketPairEnum.SOLUSD,
          MarketPairEnum.BTCUSD,
          MarketPairEnum.ETHUSD,
        ]}
        value={marketPair}
        onChange={setMarketPair}
      />
      <Segmented
        options={TimeIntervals?.map((e) => {
          return {
            label: e.title,
            value: e.seconds,
          };
        })}
        value={timeInterval}
        onChange={setTimeInterval}
        style={{ marginTop: "12px" }}
      />
    </>
  );
};

export default MarketOptions;
