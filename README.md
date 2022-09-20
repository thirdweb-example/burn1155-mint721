# Burn an ERC1155 to Mint an ERC721 NFT

Similar to the [Mutant Ape Yacht Club](https://opensea.io/collection/mutant-ape-yacht-club) collection, this template shows you how to:

1. Build a simple ERC721A Drop Contract - Mimicking the original [BAYC Collection](https://opensea.io/collection/boredapeyachtclub)
2. Build an ERC1155 Contract - Mimicking the [Serum NFT Collection](https://opensea.io/collection/bored-ape-chemistry-club)
3. Create an ERC721 Drop with restrictions on who can claim, based on their ownership of the two above collections.

## Using This Template

```
npx thirdweb create --template burn1155-mint721
```

## Released Contracts

- BAYClone: https://thirdweb.com/0xb371d1C5629C70ACd726B20a045D197c256E1054/BAYClone
- SerumClone: https://thirdweb.com/0xb371d1C5629C70ACd726B20a045D197c256E1054/SerumClone
- MAYClone: https://thirdweb.com/0xb371d1C5629C70ACd726B20a045D197c256E1054/MAYClone

## Risks

Yuga Labs, the creator of the BAYC collection created a **snapshot** of NFT owner addresses and used this as an allow-list for the MAYC drop.

This prevented users from "renting" or temporarily gaining access to a BAYC NFT in combination with a serum and claiming the MAYC NFT.

This template does not implement a similar method of preventing this behaviour.

## Guide

Below, we'll outline the key aspects of the code.

### Checking Balance Before Claiming

Before the `claim` function is run in the MAYC contract, the `verifyClaim` function logic must be true.

Here is where we ensure the claimer has sufficient balance of both the serum and the BAYC collection NFTs.

```solidity
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
```

### Burn To Claim

Before claiming from the MAYC contract, the `_beforeTokenTransfers` function is run.

In this function, we enforce the user burns a serum

```solidity
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

### Providing Contract Approval to Burn

For the contract to be able to `burn` a wallet's NFTs, it needs explicit approval.

We achieve this in the application side when the user tries to claim a MAYC from the contract, by calling `setApprovalForAll`:

```jsx
  async function mintMutantNft() {
    // Check the approval of the mayc contract to burn the user's serum tokens
    const hasApproval = await serumContract?.call(
      "isApprovedForAll",
      address,
      maycContract?.getAddress()
    );

    if (!hasApproval) {
      // Set approval
      const tx = await serumContract?.call(
        "setApprovalForAll",
        maycContract?.getAddress(),
        true
      );
    }

    const claimTx = await maycContract?.call("claim", address!, 1);
  }
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
