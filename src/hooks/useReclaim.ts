import { useMutation } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
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
    const traderWallet = preTopupAddrPublic;
    const mint = new PublicKey("DXSVQJqJbNTTcGqCkfHnQYXwG5GhZsfg2Ka9tNkK3ohr");

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      traderWallet!.publicKey,
      mint,
      traderWallet!.publicKey
    );

    let toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      traderWallet!.publicKey,
      mint,
      wallet.publicKey
    );
    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        traderWallet!.publicKey,
        1000000000 * (topupWallet / 1_000),
        [traderWallet!.publicKey],
        TOKEN_PROGRAM_ID
      )
    );
    transaction.feePayer = traderWallet!.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;

    return await sendAndConfirmTransaction(connection, transaction, [
      traderWallet!,
    ]);
  });
}

export default useReclaim;
