import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  getMarketPubkeys,
  MarketPairEnum,
  ParimutuelMarket,
  ParimutuelWeb3,
} from "@hxronetwork/parimutuelsdk";
import { PariConfig } from "../connection";

interface PariObj {
  longPool: any;
  shortPool: any;
  longOdds: string;
  shortOdds: string;
  pubkey: string;
}

export const useMarketsKey = "markets";

function useMarkets(marketPair: MarketPairEnum, timeSeconds: number) {
  const config = PariConfig.config;
  const { connection } = useConnection();
  const parimutuelWeb3 = new ParimutuelWeb3(config, connection);
  const markets = getMarketPubkeys(config, marketPair);
  const marketsByTime = markets.filter(
    (market) => market.duration === timeSeconds
  );

  return useQuery<ParimutuelMarket[]>(
    [useMarketsKey, marketPair, timeSeconds],
    async () => {
      const parimutuels = await parimutuelWeb3.getParimutuels(marketsByTime);
      const duration = marketsByTime[0].duration;
      console.log(parimutuels, duration);
      return await parimutuelWeb3.getMarkets(marketPair);
    }
  );
}

export default useMarkets;
