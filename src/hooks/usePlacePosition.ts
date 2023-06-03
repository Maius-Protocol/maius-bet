import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation } from "@tanstack/react-query";
import { PariConfig } from "../connection";
import {
  getMarketPubkeys,
  MarketPairEnum,
  ParimutuelWeb3,
  PositionSideEnum,
  WalletSigner,
} from "@hxronetwork/parimutuelsdk";
import { PublicKey } from "@solana/web3.js";

function usePlacePosition() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const wallet = useWallet();
  const config = PariConfig.config;
  const parimutuelWeb3 = new ParimutuelWeb3(config, connection);

  return useMutation(async ({ pariPubkey, side, amount }) => {
    if (!publicKey) {
      console.error("Send Transaction: Wallet not connected!");
      return;
    }
    let transactionId = "";
    try {
      transactionId = await parimutuelWeb3.placePosition(
        wallet as WalletSigner,
        new PublicKey(pariPubkey),
        parseFloat(amount) * (10 ** 9 / 1),
        side,
        Date.now()
      );

      if (transactionId) {
        console.log(`Transaction: ${transactionId}`);
      }
    } catch (error) {
      console.error(`Transaction failed! ${error.message}`, transactionId);
      return;
    }
  });
}

export default usePlacePosition;
