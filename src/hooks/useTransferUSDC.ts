import { useMutation } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useMemo } from "react";
import bs58 from "bs58";
import useLocalStorage from "use-local-storage";
import { TOPUP_WALLET_STORAGE_KEY } from "../constants";

function useTransferUSDC() {
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

    let toTokenAccount;
    try {
      toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet.publicKey,
        mint,
        to!.publicKey
      );
    } catch (e) {
      let ata = await getAssociatedTokenAddress(
        mint, // mint
        to!.publicKey, // owner
        false // allow owner off curve
      );
      console.log(`ata: ${ata.toBase58()}`);

      let tx = new Transaction();
      tx.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey, // payer
          ata, // ata
          to!.publicKey, // owner
          mint // mint
        )
      );
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

      const signature = await window.solana.signAndSendTransaction(tx);
      await connection.confirmTransaction(signature);
      toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet.publicKey,
        mint,
        to!.publicKey
      );
    }

    const transaction = new Transaction();
    transaction.add(
      createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        wallet.publicKey,
        1_000_000_000 * amount,
        [],
        TOKEN_PROGRAM_ID
      )
    );
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: to.publicKey,
        lamports: 10000000 * 5,
      })
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    return await window.solana.signAndSendTransaction(transaction);
  });
}

export default useTransferUSDC;
