// Initialize the thirdweb SDK
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import fs from "fs";
import path from "path";

(async () => {
  // Create a READ-ONLY instance of the ThirdwebSDK on the Mumbai network
  const sdk = new ThirdwebSDK("goerli"); // configure this to your network
  const contract = await sdk.getContract(
    "0x739D6BF2eD6D25e40ef0aedfcfD28e65dCd913BC"
  );

  const nfts = await contract.nft.query.all();

  // The format of the csv file should be as follows:
  // address, quantity
  // Address is the nft.owner
  // Quantity is the number of nfts owned by the address

  // Quantity needs to be calculated using reduce to get the total
  // number of nfts owned by the address

  const csv = nfts.reduce((acc, nft) => {
    const address = nft.owner;
    const quantity = acc[address] ? acc[address] + 1 : 1;
    return { ...acc, [address]: quantity };
  }, {});

  // Output the NFTs to a CSV file
  const csvString = Object.entries(csv)
    .map(([address, quantity]) => `${address},${quantity}`)
    .join("\r");

  fs.writeFileSync(path.join(path.dirname("."), "nfts.csv"), csvString);
})();
