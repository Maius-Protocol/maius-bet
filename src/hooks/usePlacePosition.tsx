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
import { Keypair, PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import bs58 from "bs58";
import useLocalStorage from "use-local-storage";
import { TOPUP_WALLET_STORAGE_KEY } from "../constants";
import { notification } from "antd";

function usePlacePosition() {
  const [preTopupAddr, setPreTopupAddr] = useLocalStorage(
    TOPUP_WALLET_STORAGE_KEY,
    ""
  );
  const [api, contextHolder] = notification.useNotification();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const wallet = useWallet();
  const config = PariConfig.config;
  const parimutuelWeb3 = new ParimutuelWeb3(config, connection);
  const keypair = useMemo(() => {
    if (preTopupAddr && preTopupAddr !== "") {
      return Keypair.fromSecretKey(bs58.decode(preTopupAddr));
    }
  }, [preTopupAddr]);

  return useMutation(
    ["place-positions"],
    async ({ useTopupWallet, pariPubkey, side, amount }) => {
      if (!publicKey) {
        console.error("Send Transaction: Wallet not connected!");
        return;
      }
      let transactionId = "";
      try {
        if (useTopupWallet) {
          transactionId = await parimutuelWeb3.placePosition(
            keypair,
            new PublicKey(pariPubkey),
            parseFloat(amount) * (10 ** 9 / 1),
            side,
            Date.now()
          );
        } else {
          transactionId = await parimutuelWeb3.placePosition(
            wallet as WalletSigner,
            new PublicKey(pariPubkey),
            parseFloat(amount) * (10 ** 9 / 1),
            side,
            Date.now()
          );
        }

        if (transactionId) {
          api.info({
            message: `Order created successfully!`,
            description: (
              <a
                target={`_blank`}
                href={`https://solana.fm/address/${transactionId}?cluster=devnet-solana`}
              ></a>
            ),
          });
          // window.alert(`Transaction: ${transactionId}`);
        }
      } catch (error) {
        window.alert(`Transaction failed! ${error.message}`, transactionId);
        return;
      }
    }
  );
}

export default usePlacePosition;
