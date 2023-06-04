import dynamic from "next/dynamic";
import { Statistic } from "antd";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useMemo } from "react";
import CountUp from "react-countup";
import { useWallet } from "@solana/wallet-adapter-react";
import useUSDCBalance from "../hooks/useUSDCBalance";
import useLocalStorage from "use-local-storage";
import { TOPUP_WALLET_STORAGE_KEY } from "../constants";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const HeaderAccount = () => {
  const [preTopupAddr, setPreTopupAddr] = useLocalStorage(
    TOPUP_WALLET_STORAGE_KEY,
    ""
  );
  const preTopupAddrPublic = useMemo(() => {
    if (preTopupAddr !== "") {
      return Keypair.fromSecretKey(bs58.decode(preTopupAddr)).publicKey;
    }
  }, [preTopupAddr]);
  const wallet = useWallet();
  const { data, isLoading: isLoadingWallet } = useUSDCBalance(wallet.publicKey);
  const { data: topupWallet, isLoading: isLoadingTopupWallet } =
    useUSDCBalance(preTopupAddrPublic);
  const formatter = (value: number) => (
    <CountUp end={value} separator="," suffix=" USDC" />
  );

  return (
    <>
      <div className="d-flex flex-row">
        <>
          {preTopupAddr !== "" && (
            <Statistic
              title="Pre-topup"
              value={topupWallet}
              precision={2}
              formatter={formatter}
              style={{ marginRight: "24px" }}
            />
          )}
          <Statistic
            title="Wallet Balance"
            value={data}
            loading={isLoadingWallet}
            precision={2}
            formatter={formatter}
          />
        </>
      </div>
      <div>
        <WalletMultiButton />
      </div>
    </>
  );
};

export default HeaderAccount;
