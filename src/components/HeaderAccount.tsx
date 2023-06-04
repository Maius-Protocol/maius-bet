import dynamic from "next/dynamic";
import { Button, Statistic } from "antd";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useMemo } from "react";
import CountUp from "react-countup";
import { useWallet } from "@solana/wallet-adapter-react";
import useUSDCBalance from "../hooks/useUSDCBalance";
import useLocalStorage from "use-local-storage";
import { TOPUP_WALLET_STORAGE_KEY } from "../constants";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import useReclaim from "../hooks/useReclaim";

const HeaderAccount = () => {
  const [preTopupAddr, setPreTopupAddr] = useLocalStorage(
    TOPUP_WALLET_STORAGE_KEY,
    ""
  );
  const { isLoading: isClaiming, mutateAsync: claim } = useReclaim();
  const preTopupAddrPublic = useMemo(() => {
    if (preTopupAddr && preTopupAddr !== "") {
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
      <div className="d-flex flex-row align-items-center">
        <>
          <Statistic
            title="Wallet Balance"
            value={data / 1_000}
            loading={isLoadingWallet}
            precision={2}
            style={{ marginRight: "24px" }}
            formatter={formatter}
          />
          {preTopupAddr !== "" && (
            <>
              <Statistic
                title="Pre-topup"
                value={topupWallet / 1_000}
                precision={2}
                formatter={formatter}
                style={{ marginRight: "24px" }}
              />
              <Button
                onClick={() => {
                  claim();
                }}
                loading={isClaiming}
                style={{ marginRight: 24 }}
                type="primary"
              >
                Reclaim Topup Wallet
              </Button>
            </>
          )}
        </>
      </div>
      <div>
        <WalletMultiButton />
      </div>
    </>
  );
};

export default HeaderAccount;
