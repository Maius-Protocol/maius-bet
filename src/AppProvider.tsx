import { createContext, useContext, useState } from "react";
import { MarketPairEnum } from "@hxronetwork/parimutuelsdk";

export const AppProviderContext = createContext<any>({});
export const TimeIntervals = [
  {
    seconds: 60,
    title: "1 minutes",
  },
  {
    seconds: 300,
    title: "5 minutes",
  },
  {
    seconds: 900,
    title: "15 minutes",
  },
  {
    seconds: 3600,
    title: "1 hour",
  },
  {
    seconds: 86400,
    title: "1 day",
  },
];

export function useAppProvider(): any {
  return useContext(AppProviderContext);
}
export const AppProvider = ({ children }) => {
  const [marketPair, setMarketPair] = useState<string | number>(
    MarketPairEnum.SOLUSD
  );
  const [timeInterval, setTimeInterval] = useState<any>(
    TimeIntervals[0].seconds
  );
  return (
    <AppProviderContext.Provider
      value={{ marketPair, timeInterval, setMarketPair, setTimeInterval }}
    >
      {children}
    </AppProviderContext.Provider>
  );
};

export default AppProvider;
