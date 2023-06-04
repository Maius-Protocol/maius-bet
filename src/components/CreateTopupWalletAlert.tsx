import { Alert, Button, Space } from "antd";
import React from "react";
import useLocalStorage from "use-local-storage";
import { TOPUP_WALLET_STORAGE_KEY } from "../constants";
import { Keypair } from "@solana/web3.js";
import { UnmountClosed } from "react-collapse";
import { encode } from "bs58";

const CreateTopupWalletAlert = () => {
  const [preTopupAddr, setPreTopupAddr] = useLocalStorage(
    TOPUP_WALLET_STORAGE_KEY,
    ""
  );

  return (
    <UnmountClosed isOpened={preTopupAddr === ""}>
      <Alert
        message="Automatic Place Positions"
        description="To place positions automatically, we need to create a sub-wallet. This wallet will be stored only on your computer"
        type="info"
        action={
          <Space direction="vertical">
            <Button
              onClick={() => {
                const keypair = Keypair.generate();
                setPreTopupAddr(encode(keypair.secretKey));
              }}
              size="small"
              type="primary"
            >
              Accept
            </Button>
          </Space>
        }
      />
    </UnmountClosed>
  );
};

export default CreateTopupWalletAlert;
