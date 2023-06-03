import { useQuery } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PariConfig } from "../connection";
import {
  MarketPairEnum,
  ParimutuelMarket,
  ParimutuelPosition,
  ParimutuelWeb3,
} from "@hxronetwork/parimutuelsdk";
import useMarkets from "./useMarkets";

function usePositions(marketPair: MarketPairEnum, timeSeconds: number) {
  const { connection } = useConnection();
  const { data: marketsData } = useMarkets(marketPair, timeSeconds);
  const { publicKey, signTransaction } = useWallet();
  const config = PariConfig.config;
  const parimutuelWeb3 = new ParimutuelWeb3(config, connection);
  return useQuery<ParimutuelPosition[]>(
    ["positions", publicKey?.toBase58(), marketPair, timeSeconds],
    async () => {
      const response = await parimutuelWeb3.getUserPositions(
        publicKey!,
        marketsData || []
      );
      return response;
    },
    {
      enabled: !!publicKey,
      // refetchInterval: 3000,
    }
  );
}

export default usePositions;
