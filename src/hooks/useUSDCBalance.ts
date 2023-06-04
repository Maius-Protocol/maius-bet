import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

function useUSDCBalance(walletAddress: PublicKey) {
  const { connection } = useConnection();

  return useQuery(
    ["balance", walletAddress?.toBase58()],
    async () => {
      const usdcMint = new PublicKey(
        "DXSVQJqJbNTTcGqCkfHnQYXwG5GhZsfg2Ka9tNkK3ohr"
      ); //new
      const usdcAddress = await getAssociatedTokenAddress(
        usdcMint,
        walletAddress
      ); //new
      const usdcDetails = await getAccount(connection, usdcAddress); //new
      const usdcDecimals = 6; //new
      const usdcBalance =
        Number(usdcDetails.amount) / Math.pow(10, usdcDecimals); //new

      return usdcBalance;
    },
    {
      refetchInterval: process.env.NODE_ENV === "production" ? 6000 : false,
    }
  );
}

export default useUSDCBalance;
