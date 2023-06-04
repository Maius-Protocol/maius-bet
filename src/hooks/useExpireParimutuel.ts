import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  getMarketPubkeys,
  MarketPairEnum,
  ParimutuelWeb3,
} from "@hxronetwork/parimutuelsdk";
import { PariConfig } from "../connection";

export const useExpireParimutuelsKey = "expire-parimutuels";
interface ExpirePariObj {
  pubkey: string; // This is the contest pubkey
  expired: boolean;
  strike: number;
  index: number;
  timeWindowStart: number;
}
function useExpireParimutuels(
  marketPair: MarketPairEnum,
  timeSeconds: number,
  publicKey: string
) {
  const config = PariConfig.config;
  const { connection } = useConnection();
  const parimutuelWeb3 = new ParimutuelWeb3(config, connection);
  const markets = getMarketPubkeys(config, marketPair);
  const marketsByTime = markets.filter(
    (market) => market.duration === timeSeconds
  );
  return useQuery<ExpirePariObj | undefined>(
    [useExpireParimutuelsKey, marketPair, timeSeconds, publicKey],
    async () => {
      const parimutuels = await parimutuelWeb3.getParimutuels(marketsByTime);
      const pari_markets = parimutuels.filter(
        (account) => account.pubkey.toBase58() === publicKey
      );

      if (!pari_markets || pari_markets?.length === 0) {
        return undefined;
      }

      const expired = pari_markets[0].info.parimutuel.expired;
      const strike =
        pari_markets[0].info.parimutuel.strike.toNumber() / 1_00_000_000;
      const index =
        pari_markets[0].info.parimutuel.index.toNumber() / 1_00_000_000;
      const pubkey = pari_markets[0].pubkey.toBase58();
      const timeWindowStart =
        pari_markets[0].info.parimutuel.timeWindowStart.toNumber();
      return { pubkey, expired, strike, index, timeWindowStart };
    }
  );
}

export default useExpireParimutuels;
