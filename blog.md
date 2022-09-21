In this guide, we'll show you how to create a clone of the MAYC collection drop where users from an original collection will be airdropped serums that can be used to mint a MAYC NFT. When the user claims the NFT, the serum will be burned.

Before we get started, below are some helpful resources where you can learn more about the tools we will use in this guide.

- [View project source code](https://github.com/thirdweb-example/burn1155-mint721)
- [Deploy](https://portal.thirdweb.com/deploy)

Let's get started!

## Setup

To build the smart contract we will be using Hardhat.

Hardhat is an Ethereum development environment and framework designed for full stack development in Solidity. Simply put, you can write your smart contract, deploy it, run tests, and debug your code.

### Setting up a new hardhat project

Create a folder where the hardhat project and the Next.js app will go. To create a folder, open up your terminal and execute these commands

```bash
mkdir mayc-clone
cd mayc-clone
```

Now, we will use the thirdweb CLI to generate a new hardhat project! So, run this command:

```
npx thirdweb create --contract
```

When it asks what type of project, you must select an empty one!

Now you have a hardhat project ready to go!

### Setting up the frontend

I am going to use the [Next.js Typescript starter template](https://github.com/thirdweb-example/next-typescript-starter) for this guide.

If you are following along with the guide, you can create a project with the template using the [thirdweb CLI](https://github.com/thirdweb-dev/js/tree/main/packages/cli):

```
npx thirdweb create --next --ts
```

If you already have a Next.js app you can simply follow these steps to get started:

- Install `@thirdweb-dev/react` and `@thirdweb-dev/sdk` and `ethers`.

- Add MetaMask authentication to the site. You can follow this [guide](https://portal.thirdweb.com/guides/add-connectwallet-to-your-website) to add metamask auth.

## Creating the Smart Contracts

### Writing the smart contracts

#### BAYClone.sol

We will now write our smart contracts! Create a new file `BAYClone.sol` in the `contracts` folder. We are going to use the thirdweb contracts extend feature to create a new NFT drop. So, paste the following into it

```sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Drop.sol";

contract BAYClone is ERC721Drop {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC721Drop(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps,
            _primarySaleRecipient
        )
    {}
}
```

Here, we are importing the `ERC721Drop` contract from the thirdweb contracts package. This contract is a base contract that allows us to create a new NFT drop. We are also passing in the name, symbol, royalty recipient, royalty bps, and primary sale recipient to the constructor.

#### SerumClone.sol

Next, we will create a new contract that will be the collection of the serum. This will be an ERC1155 contract. Create a new file `SerumClone.sol` in the `contracts` folder. We will also use the thirdweb contracts extend feature to create a new ERC1155 collection. So, paste the following into it

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155Base.sol";

contract SerumClone is ERC1155Base {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC1155Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
}
```

Here, just like the BAYC Clone, we are extending a base contract from the thirdweb contracts package. This time, we are extending the `ERC1155Base` contract. We are also passing in the name, symbol, royalty recipient, and royalty bps to the constructor.

#### MAYClone.sol

Finally, we will write our MAYC Clone, the most important contract. Here we are going to extend the ERC721Drop contract and add some extra functionality. Create a new file `MAYClone.sol` in the `contracts` folder. Paste the following into it

```sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721LazyMint.sol";
import "@thirdweb-dev/contracts/base/ERC1155Base.sol";
import "@thirdweb-dev/contracts/base/ERC721Drop.sol";

contract MAYClone is ERC721LazyMint {
    // Store constant values for the 2 NFT Collections:
    // 1. Is the BAYC NFT Collection
    ERC721LazyMint public immutable bayc;
    // 2. Is the Serum NFT Collection
    ERC1155Base public immutable serum;

    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _baycAddress,
        address _serumAddress
    ) ERC721LazyMint(_name, _symbol, _royaltyRecipient, _royaltyBps) {
        bayc = ERC721LazyMint(_baycAddress);
        serum = ERC1155Base(_serumAddress);
    }
}
```

Here, we are extending the `ERC721LazyMint` contract. We are also taking in the BAYC and Serum contract addresses as constructor arguments. Now, let's add the extra functions to the contract!

```sol
 function verifyClaim(address _claimer, uint256 _quantity)
        public
        view
        virtual
        override
    {
        // 1. Override the claim function to ensure a few things:
        // - They own an NFT from the BAYClone contract
        require(bayc.balanceOf(_claimer) >= _quantity, "You don't own enough BAYC NFTs");
        // - They own an NFT from the SerumClone contract
        require(serum.balanceOf(_claimer, 0) >= _quantity, "You don't own enough Serum NFTs");
    }

    function transferTokensOnClaim(address _receiver, uint256 _quantity) internal override returns(uint256) {
        serum.burn(
            _receiver,
            0,
            _quantity
        );

        // Use the rest of the inherited claim function logic
      return super.transferTokensOnClaim(_receiver, _quantity);
    }
```

The verifyClaim function checks if the user owns enough BAYC and Serum NFTs. The transferTokensOnClaim function burns the Serum NFTs from the user and then calls the inherited transferTokensOnClaim function.

Now that we have written our smart contracts, we will go ahead and deploy our contract using [deploy](https://portal.thirdweb.com/deploy).

### Deploying the contracts

```
npx thirdweb deploy
```

This command allows you to avoid the painful process of setting up your entire project like setting up RPC URLs, exporting private keys, and writing scripts. Now, you will get options to choose which contract to deploy. We need to deploy all three of them so we will deploy them one by one.

![Deploy](https://cdn.hashnode.com/res/hashnode/image/upload/v1663642971252/3pl_H4Sj8.png)

#### BAYClone

First, let's deploy the BAYC Clone contract. Choose the BAYC Clone contract after filling out the form with your values. Deploy the contract!

![BAYC](https://cdn.hashnode.com/res/hashnode/image/upload/v1663643170328/03vRMkX8S.png)

Now, choose the network you want to deploy your contract to! I am going to use Goerli but you can use whichever one you like. Once you have selected your network click on `Deploy now!`

After the transactions are mined you will be taken to the dashboard which consists of many options. Feel free to explorer them but for now we will move on with other contracts!

#### SerumClone

Now, deploy the SerumContract in the same way as you did for the BAYC Clone contract.

#### MAYClone

Finally, deploy the MAYC Clone contract. The deployment process will be the same as the BAYC clone and Serum Clone but you need to pass in these two addresses as well!

## Minting NFTs from BAYC Clone

We need to set up a claim phase so that people can claim our NFTs. We will claim one ourselves for testing as well. Go to the Claim Conditions and create a new claim phase with the parameters that you need!

![Claim Conditions](https://cdn.hashnode.com/res/hashnode/image/upload/v1663643639337/q_Q0wVym9.png)

Now, go to the NFTs tab. Let's batch upload some NFTs for the users to mint. For this guide, I am going to use the [Shapes batch upload example](https://github.com/saminacodes/tw-demo-assets/tree/main/Shapes).

Click on batch upload and upload the images and the CSV/JSON file.

Once they are uploaded you will be able to see the NFTs! To learn more about batch upload check out [this guide](https://portal.thirdweb.com/guides/how-to-batch-upload).

Now, we need to claim some NFTs to test out the process. Go to the explorer tab and click on the claim option. Now, fill out the data I am using the following values:

- \_receiver: 0x477856f90EdE4D4669f222889947bE5EE43424Db
- \_quantity: 2
- \_currency: 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
- \_pricePerToken: 0
- \_allowlistProof: { "proof": ["0x0000000000000000000000000000000000000000000000000000000000000000"], "maxQuantityInAllowlist": 0 }
- \_data: []
- Native Token Value: 0

![Claim NFT](https://cdn.hashnode.com/res/hashnode/image/upload/v1663644080632/C5L7wIB9T.png)

Click execute and confirm the transaction. Now, you can see that the NFTs have been claimed!

## Airdropping NFTs from MAYC Clone

We need to add an erc 1155 token that will be airdropped to the owners of the BAYC collection, so go to the NFTs tab and click on mint. Fill out the details and click Mint!

To airdrop the serums we will create a script that will get all the owners of the BAYC NFTs and create a CSV file from it. Then we will use this CSV file to airdrop the serums. So, in our `application` folder, create a new file called `scripts/getAll.mjs` and add the following:

```js
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import fs from "fs";
import path from "path";

(async () => {
  const sdk = new ThirdwebSDK("goerli");
  const contract = await sdk.getContract(
    "0x3714e40A15Deffb8E43A58b018bD81C2c6AC2445"
  );

  if (!contract) {
    return;
  }

  const nfts = await contract?.nft?.query?.all();

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
```

Update your contract address, and run the script. You will see a new `nfts.csv` file like this:

```csv
address,quantity
0xb371d1C5629C70ACd726B20a045D197c256E1054,1
```

Once you are done updating/checking your CSV file, go back to the dashboard and click on your NFT. Go to the airdrop tab and upload your addresses. Once done, click deploy and the serums will be airdropped to the addresses!

## Adding NFTs to MAYC Clone

Just like we added NFTs to the BAYC Clone, we need to add the NFTs to MAYC clone as well.

## Building the frontend

Now, let's build our frontend so that people can claim the MAYC NFTs! To keep our code clean we will store the mayc and serum addresses as a variable in `const/contractAddresses.ts`:

```ts
export const MAYC_ADDRESS = "0xE0e3fd6782a3b87aB1bab5d78CDAF75cB453BCbe";
export const SERUM_ADDRESS = "0xDAcd1CDB5A144fC6fa3c55F290be778Ca47C5187";
```

Now, in `pages/index.tsx` we will use the `Web3Button` component to allow users to claim the NFT:

```ts
return (
  <div>
    <Web3Button
      contractAddress={MAYC_ADDRESS}
      action={(contract) => mintMutantNft(contract)}
    >
      Mint Your Mutant NFT
    </Web3Button>
  </div>
);
```

The MAYC_ADDRESS will be imported from our contractAddresses file. And as you can see we also have a function called `mintMutantNft` so let's create that:

```tsx
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
```

Here, we are getting the serumContract and asking for approval first as the contract needs to burn the serum. To get the address and maycContract we will use some hooks:

```ts
const address = useAddress();
const { contract: serumContract } = useContract(SERUM_ADDRESS);
```

Now, if we test out our app everything works! 🥳

## Conclusion

In this guide, we learnt how to use the bases extensions to create a MAYC clone. If you built the Dapp pat yourself on the back and share it with us on the [thirdweb discord](https://discord.gg/thirdweb)! If you want to take a look at the code, check out the [GitHub Repository](https://github.com/thirdweb-example/burn1155-mint721).
