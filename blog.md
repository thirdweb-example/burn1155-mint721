# Create a MAYC collection clone

In this guide, we'll show you how to create a clone of the MAYC collection drop where users from an original collection will be airdropped serums that can be used to mint a MAYC NFT. When the user claims the NFT, the serum will be burned.

Before we get started, below are some helpful resources where you can learn more about the tools we're going to be using in this guide.

- [View project source code](https://github.com/thirdweb-example/burn1155-mint721)
- [Deploy](https://portal.thirdweb.com/deploy)

Let's get started!

## Creating the Smart Contract

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

When it asks for what type of project, you need to select an empty project!

Now you have a hardhat project ready to go!

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

Next, we will create a new contract that will be the serums collection. This will be an ERC1155 contract. Create a new file `SerumClone.sol` in the `contracts` folder. We will also use the thirdweb contracts extend feature to create a new ERC1155 collection. So, paste the following into it

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

Here, just like the BAYC Clone we are extending a base contract from the thirdweb contracts package. This time, we are extending the `ERC1155Base` contract. We are also passing in the name, symbol, royalty recipient, and royalty bps to the constructor.

#### MAYClone.sol

Finally, we will write our MAYC Clone contract which is the most important contract. Here we are going to extend the ERC721Drop contract and add some extra functionality. Create a new file `MAYClone.sol` in the `contracts` folder. Paste the following into it

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

    // 2. Within the claim, we need to burn 1 quantity of the serum
    function claim(address _receiver, uint256 _quantity) public payable virtual override {
        // Use the rest of the inherited claim function logic
        super.claim(_receiver, _quantity);

        // Add our custom logic to burn the serum NFTs from the caller
        serum.burn(
            _receiver,
            0,
            _quantity
        );
    }
```

The verifyClaim function checks if the user owns enough BAYC and Serum NFTs. The claim function burns the Serum NFTs from the user and then calls the inherited claim function.

Now that we have written our smart contracts, we will go ahead and deploy our contract using [deploy](https://portal.thirdweb.com/deploy).

### Deploying the contracts

```
npx thirdweb deploy
```

This command allows you to avoid the painful process of setting up your entire project like setting up RPC URLs, exporting private keys, and writing scripts. Now, you will get options to choose which contract to deploy. We need to deploy all three of them so we will deploy them one by one. First, let's deploy the BAYC Clone contract. Choose the BAYC Clone contract and then enter the following values in teh dashboard

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950728342/gyi2Ncb6E.png)

Now, choose the network you want to deploy your contract to! I am going to use Goerli but you can use whichever one you like. Once you have chosen your network click on `Deploy now!`

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950749737/MnEbNy4e9.png)

After the transactions are mined you will be taken to the dashboard which consists of many options.

- In the **overview** section, you can explore your contract and interact with the functions without having to integrate them within your frontend code yet so it gives you a better idea of how your functions are working and also acts as a good testing environment.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950763730/N7VfzapNu.png)

- In the **code** section, you see the different languages and ways you can interact with your contract. Which we will look into later on in the tutorial.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950773074/p8tPFb8IL.png)

- In the **events** section, you can see all the transactions you make.
- You can also customize the \***\*settings\*\*** after enabling the required interfaces in the settings section.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950781456/P7KkWsUJW.png)

- In the **source** section, you can see your smart contract and it also gives you a verification button to the relevant chain to which you have deployed your contract.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950801089/--qY0EUby.png)

## Conclusion

In this guide, we learnt how to use thirdweb auth to allow only users who have contributed to our repos to mint an NFT!

If you did as well pat yourself on the back and share it with us on the [thirdweb discord](https://discord.gg/thirdweb)! If you want to take a look at the code, check out the [GitHub Repository](https://github.com/thirdweb-example/github-contributor-nft-rewards).
