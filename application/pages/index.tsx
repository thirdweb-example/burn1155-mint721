import { useAddress, useContract, Web3Button } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/smart-contract";
import { BaseContract } from "ethers";
import type { NextPage } from "next";
import { MAYC_ADDRESS, SERUM_ADDRESS } from "../const/contractAddresses";
import styles from "../styles/Theme.module.css";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: serumContract } = useContract(SERUM_ADDRESS);

  const mintMutantNft = async (maycContract: SmartContract<BaseContract>) => {
    // 1. Check the approval of the mayc contract to burn the user's serum tokens
    const hasApproval = await serumContract?.call(
      "isApprovedForAll",
      address,
      maycContract?.getAddress()
    );
    const balance = await serumContract?.call("balanceOf", address, 0);

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

    await maycContract?.call("claim", address!, 1);
  };

  return (
    <div className={styles.container} style={{ marginTop: "3rem" }}>

      <Web3Button
        contractAddress={MAYC_ADDRESS}
        action={(contract) => mintMutantNft(contract)}
      >
        Mint Your Mutant NFT
      </Web3Button>
    </div>
  );
};

export default Home;
