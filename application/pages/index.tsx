import type { NextPage } from "next";
import { useAddress, useContract, Web3Button } from "@thirdweb-dev/react";
import { MAYC_ADDRESS, SERUM_ADDRESS } from "../const/contractAddresses";
import styles from "../styles/Theme.module.css";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: maycContract } = useContract(MAYC_ADDRESS);
  const { contract: serumContract } = useContract(SERUM_ADDRESS);

  async function mintMutantNft() {
    // 1. Check the approval of the mayc contract to burn the user's serum tokens
    const hasApproval = await serumContract?.call(
      "isApprovedForAll",
      address,
      maycContract?.getAddress()
    );

    console.log(hasApproval);

    if (!hasApproval) {
      // Set approval
      const tx = await serumContract?.call(
        "setApprovalForAll",
        maycContract?.getAddress(),
        true
      );
    }

    const claimTx = await maycContract?.call("claim", address!, 1);

    console.log(claimTx);
  }

  return (
    <div className={styles.container} style={{ marginTop: "3rem" }}>
      <p>Welcome, {address}</p>
      <Web3Button
        contractAddress={MAYC_ADDRESS}
        action={(contract) => mintMutantNft()}
        accentColor="#F213A4"
        colorMode="dark"
      >
        Mint Your Mutant NFT
      </Web3Button>
    </div>
  );
};

export default Home;
