import { Avatar, Button, List, Tag } from "antd";
import { colors } from "../colors";
import { useAppProvider } from "../AppProvider";
import usePositions from "../hooks/usePositions";
import OrderHistoryItem from "./OrderHistoryItem";
import React, { useMemo } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import useLocalStorage from "use-local-storage";
import { TOPUP_WALLET_STORAGE_KEY } from "../constants";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const OrderHistory = () => {
  const { marketPair, timeInterval } = useAppProvider();
  const { publicKey, signTransaction } = useWallet();
  const [preTopupAddr, setPreTopupAddr] = useLocalStorage(
    TOPUP_WALLET_STORAGE_KEY,
    ""
  );

  const preTopupAddrPublic = useMemo(() => {
    if (preTopupAddr && preTopupAddr !== "") {
      return Keypair.fromSecretKey(bs58.decode(preTopupAddr));
    }
  }, [preTopupAddr]);
  const { data: positionsData, isLoading } = usePositions(
    marketPair,
    timeInterval,
    publicKey!
  );
  const { data: positionsTopupData, isLoading: isLoadingTopup } = usePositions(
    marketPair,
    timeInterval,
    preTopupAddrPublic?.publicKey!
  );
  const isMutating = Boolean(useIsMutating(["place-positions"]));

  return (
    <List
      header="Orders Book"
      itemLayout="horizontal"
      dataSource={
        [...(positionsData || []), ...(positionsTopupData || [])] || []
      }
      bordered
      loading={isLoading || isMutating || isLoadingTopup}
      style={{ backgroundColor: colors.cardBackground }}
      renderItem={(item, index) => {
        return <OrderHistoryItem item={item}></OrderHistoryItem>;
      }}
    />
  );
};

export default OrderHistory;
