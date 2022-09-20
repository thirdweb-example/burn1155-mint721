// Initialize the thirdweb SDK
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import fs from "fs";
import path from "path";

(async () => {
  // Create a READ-ONLY instance of the ThirdwebSDK on the Mumbai network
  const sdk = new ThirdwebSDK("goerli"); // configure this to your network
  const contract = await sdk.getContract(
    "0x3714e40A15Deffb8E43A58b018bD81C2c6AC2445"
  );

  if (!contract) {
    return;
  }

  const nfts = await contract?.nft?.query?.all();

  // The format of the csv file should be as follows:
  // address, quantity
  // Address is the nft.owner
  // Quantity is the number of nfts owned by the address

  // Quantity needs to be calculated using reduce to get the total
  // number of nfts owned by the address

  if (!nfts) {
    return;
  }

  const csv = nfts?.reduce((acc, nft) => {
    const address = nft.owner;
    const quantity = acc[address] ? acc[address] + 1 : 1;
    return { ...acc, [address]: quantity };
  }, {});

  const filteredCsv = Object.keys(csv).reduce((acc, key) => {
    if (key !== "0x0000000000000000000000000000000000000000") {
      return {
        ...acc,
        [key]: csv[key],
      };
    }
    return acc;
  }, {});

  const csvString =
    "address,quantity \r" +
    Object.entries(filteredCsv)
      .map(([address, quantity]) => `${address},${quantity}`)
      .join("\r");

  fs.writeFileSync(path.join(path.dirname("."), "nfts.csv"), csvString);
  console.log("Generated nfts.csv");
})();
