import { useMutation } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useMemo } from "react";
import bs58 from "bs58";
import useLocalStorage from "use-local-storage";
import { TOPUP_WALLET_STORAGE_KEY } from "../constants";
import useUSDCBalance from "./useUSDCBalance";

function useReclaim() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const publicKey = wallet.publicKey;
  const [preTopupAddr, setPreTopupAddr] = useLocalStorage(
    TOPUP_WALLET_STORAGE_KEY,
    ""
  );

  const preTopupAddrPublic = useMemo(() => {
    if (preTopupAddr && preTopupAddr !== "") {
      return Keypair.fromSecretKey(bs58.decode(preTopupAddr));
    }
  }, [preTopupAddr]);
  const { data: topupWallet } = useUSDCBalance(preTopupAddrPublic?.publicKey);

  return useMutation(async (amount: number) => {
    const to = preTopupAddrPublic;
    const mint = new PublicKey("DXSVQJqJbNTTcGqCkfHnQYXwG5GhZsfg2Ka9tNkK3ohr");

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      publicKey,
      mint,
      publicKey,
      wallet.signTransaction
    );

    let toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.publicKey,
      mint,
      to!.publicKey
    );
    const transaction = new Transaction().add(
      createTransferInstruction(
        toTokenAccount.address,
        fromTokenAccount.address,
        toTokenAccount.publicKey,
        1000000000 * (topupWallet / 1_000),
        [wallet.publicKey, to!.publicKey],
        TOKEN_PROGRAM_ID
      )
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    // transaction.sign(preTopupAddrPublic);
    return await window.solana.signAndSendTransaction(transaction);
  });
}

export default useReclaim;
