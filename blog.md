# Create a MAYC collection clone

In this guide, we'll show you how to create a clone of the MAYC collection drop where users from an original collection will be airdropped serums that can be used to mint a MAYC NFT. When the user claims the NFT, the serum will be burned.

Before we get started, below are some helpful resources where you can learn more about the tools we're going to be using in this guide.

- [View project source code](https://github.com/avneesh0612/github-contributor-nft-rewards)
- [Deploy](https://portal.thirdweb.com/deploy)

Let's get started!

## Creating the Smart Contract

To build the smart contract we will be using Hardhat.

Hardhat is an Ethereum development environment and framework designed for full stack development in Solidity. Simply put, you can write your smart contract, deploy it, run tests, and debug your code.

### Setting up a new hardhat project

Create a folder where the hardhat project and the Next.js app will go. To create a folder, open up your terminal and execute these commands

```bash
mkdir todo-dapp
cd todo-dapp
```

Now, we will use the thirdweb CLI to generate a new hardhat project! So, run this command:

```
npx thirdweb create --contract
```

When it asks for what type of project, you need to select an empty project!

Now you have a hardhat project ready to go!

### Writing the smart contract

Once the app is created, create a new file inside the contracts directory called `Todo.sol` and add the following code:

```
// SPDX-License-Identifier: MIT

// specify the solidity version here
pragma solidity ^0.8.0;

contract Todos {
    // We will declare an array of strings called todos
    string[] public todos;

    // We will take _todo as input and push it inside the array in this function
    function setTodo(string memory _todo) public {
        todos.push(_todo);
    }

    // In this function we are just returning the array
    function getTodo() public view returns (string[] memory) {
        return todos;
    }

    // Here we are returning the length of the todos array
    function getTodosLength() public view returns (uint) {
        uint todosLength = todos.length;
        return todosLength;
    }

    // We are using the pop method to remove a todo from the array as you can see we are just removing one index
    function deleteToDo(uint _index) public {
        require(_index < todos.length, "This todo index does not exist.");
        todos[_index] = todos[getTodosLength() - 1];
        todos.pop();
    }
}
```

This smart contract allows you to add todos to your contract, remove them, get their length and return the array which consists of all the tasks you have set up.

Now that we have written our basic `Todos` smart contract, we will go ahead and deploy our contract using [deploy](https://portal.thirdweb.com/deploy).

### Deploying the contract

```
npx thirdweb deploy
```

This command allows you to avoid the painful process of setting up your entire project like setting up RPC URLs, exporting private keys, and writing scripts.

Upon success, a new tab will automatically open and you should be able to see a link to the dashboard in your CLI.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950728342/gyi2Ncb6E.png align="left")

Now, choose the network you want to deploy your contract to! I am going to use Goerli but you can use whichever one you like. Once you have chosen your network click on `Deploy now!`

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950749737/MnEbNy4e9.png align="left")

After the transactions are mined you will be taken to the dashboard which consists of many options.

- In the **overview** section, you can explore your contract and interact with the functions without having to integrate them within your frontend code yet so it gives you a better idea of how your functions are working and also acts as a good testing environment.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950763730/N7VfzapNu.png align="left")
![]("__GHOST_URL__/content/images/2022/09/image-15.png")

- In the **code** section, you see the different languages and ways you can interact with your contract. Which we will look into later on in the tutorial.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950773074/p8tPFb8IL.png align="left")

- In the **events** section, you can see all the transactions you make.
- You can also customize the \***\*settings\*\*** after enabling the required interfaces in the settings section.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950781456/P7KkWsUJW.png align="left")
[]("__GHOST_URL__/content/images/2022/09/image-18.png")

- In the **source** section, you can see your smart contract and it also gives you a verification button to the relevant chain to which you have deployed your contract.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662950801089/--qY0EUby.png align="left")

## Conclusion

In this guide, we learnt how to use thirdweb auth to allow only users who have contributed to our repos to mint an NFT!

If you did as well pat yourself on the back and share it with us on the [thirdweb discord](https://discord.gg/thirdweb)! If you want to take a look at the code, check out the [GitHub Repository](https://github.com/thirdweb-example/github-contributor-nft-rewards).
