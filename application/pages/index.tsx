import {
  useAddress,
  useContract,
  useContractRead,
  Web3Button,
} from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract } from "ethers";
import type { NextPage } from "next";
import { useState } from "react";
import { MAYC_ADDRESS, SERUM_ADDRESS } from "../const/contractAddresses";
import styles from "../styles/Theme.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  const { contract: serumContract } = useContract(SERUM_ADDRESS, "nft-drop");
  const { data: balance } = useContractRead(
    serumContract,
    "balanceOf",
    address
  );
  const [quantity, setQuantity] = useState(1);

  const mintMutantNft = async (maycContract: SmartContract<BaseContract>) => {
    // 1. Check the approval of the mayc contract to burn the user's serum tokens
    const hasApproval = await serumContract?.call(
      "isApprovedForAll",
      address,
      maycContract?.getAddress()
    );

    if (!hasApproval) {
      // Set approval
      await serumContract?.call(
        "setApprovalForAll",
        maycContract?.getAddress(),
        true
      );
    }

    if (balance < 1) {
      return alert("Not enough serum tokens");
    }

    await maycContract?.call("claim", address!, quantity);
  };

  return (
    <div className={styles.container}>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <Web3Button
        contractAddress={MAYC_ADDRESS}
        action={(contract) => mintMutantNft(contract)}
        isDisabled={balance < quantity}
      >
        Mint Your Mutant NFT
      </Web3Button>
    </div>
  );
};

export default Home;
