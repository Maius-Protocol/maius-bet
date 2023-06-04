import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  getMarketPubkeys,
  MarketPairEnum,
  ParimutuelAccount,
  ParimutuelWeb3,
  calculateNetOdd,
} from "@hxronetwork/parimutuelsdk";
import { PariConfig } from "../connection";

export const useParimutuelsKey = "parimutuels";
interface PariObj {
  longPool: any; // This is how much money is in the Long Pool of the contest
  shortPool: any; // This is how much money is in the Short Pool of the contest
  longOdds: string; // This is the weighted odds of the Long Pool
  shortOdds: string; // This is the weighted odds of the Short Pool
  pubkey: string; // This is the contest pubkey
  locksTime: number; // This is the contest pubkey
}
function useParimutuels(marketPair: MarketPairEnum, timeSeconds: number) {
  const config = PariConfig.config;
  const { connection } = useConnection();
  const parimutuelWeb3 = new ParimutuelWeb3(config, connection);
  const markets = getMarketPubkeys(config, marketPair);
  const marketsByTime = markets.filter(
    (market) => market.duration === timeSeconds
  );

  return useQuery<PariObj | undefined>(
    [useParimutuelsKey, marketPair, timeSeconds],
    async () => {
      const parimutuels = await parimutuelWeb3.getParimutuels(marketsByTime);
      let pari_markets = parimutuels.filter(
        (account) =>
          account.info.parimutuel.timeWindowStart.toNumber() > Date.now() &&
          account.info.parimutuel.timeWindowStart.toNumber() <
            Date.now() + timeSeconds * 1000
      );

      if (!pari_markets || pari_markets?.length === 0) {
        return undefined;
      }

      console.log(pari_markets);
      let longPool: any =
        pari_markets[0].info.parimutuel.activeLongPositions.toNumber() /
        1_000_000_000;
      let shortPool: any =
        pari_markets[0].info.parimutuel.activeShortPositions.toNumber() /
        1_000_000_000;
      const longOdds = calculateNetOdd(longPool, longPool + shortPool, 0.03);
      const shortOdds = calculateNetOdd(shortPool, longPool + shortPool, 0.03);

      longPool = longPool.toFixed(2);
      shortPool = shortPool.toFixed(2);
      const pubkey = pari_markets[0].pubkey.toString();

      const locksTime =
        pari_markets[0].info.parimutuel.timeWindowStart.toNumber();

      return { longPool, shortPool, longOdds, shortOdds, pubkey, locksTime };
    },
    {
      cacheTime: 1000,
      staleTime: 1000,
      refetchInterval: 15000,
    }
  );
}

export default useParimutuels;
