# Learn Solidity from Ethernaut
https://ethernaut.openzeppelin.com/

In this repository, I will explain each topic I learned from Ethernaut.

**1. Hello Ethernaut**
   - You can enter these commands in your browser's console
        ```shell
        player()                // get wallet address
        getBalance(player)      // get player balance
        help()                  // get all commands
        ethernaut               // get game's main smart contract
        await ethernaut.owner() // getethernaut's owner wallet address
        ```

        example:
        ![](/images/2022-08-13-15-37-14.png)
        
**2. Fallback**
   

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';

contract Fallback {

  using SafeMath for uint256;
  mapping(address => uint) public contributions;
  address payable public owner;

  constructor() public {
    owner = msg.sender;
    contributions[msg.sender] = 1000 * (1 ether);
  }

  modifier onlyOwner {
        require(
            msg.sender == owner,
            "caller is not the owner"
        );
        _;
    }

  function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if(contributions[msg.sender] > contributions[owner]) {
      owner = msg.sender;
    }
  }

  function getContribution() public view returns (uint) {
    return contributions[msg.sender];
  }

  function withdraw() public onlyOwner {
    owner.transfer(address(this).balance);
  }

  receive() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
  }
}
```

- Description from Ethernaut
```
        Look carefully at the contract's code below.

        You will beat this level if

                1. you claim ownership of the contract
                2. you reduce its balance to 0

        Things that might help

        * How to send ether when interacting with an ABI
        * How to send ether outside of the ABI
        * Converting to and from wei/ether units (see help() command)
        * Fallback methods
```

  - In this level we need to claim ownership of the contract and reduce it's balance to 0. 
    - How to cliam ownership?
      - In the Fallback contract, we will see a `contribute` function that has conditions if we send ETH more than the owner balance of the contract. We will be the owner of the contract. But it requires ETH that we passed to the `contribute` function must be less than 0.001 ETH, so we can't be coming to the owner of the contract. Let's look at the `receive` function, it requires ETH more than 0, and the contribution balance must be more than 0. So if we call the `contribute` function and send ETH more than 0 but less than 0.001 ETH. After that, we call the `receive` (fallback function) function by sending ETH more than 0 ETH to the contract. We will become the owner of the contract.
        ```shell
        await contract.contribute({value: toWei('0.000001')})
        await sendTransaction({from: player, to: contract.address, value: toWei('0.00001')})
        ```
        - Note!: Why did not call receive function?
          - The receive/fallback function is executed on a call to the contract if none of the other functions match the given function signature, or if no data was supplied at all. REF: [https://docs.soliditylang.org/en/v0.8.15/contracts.html]
    - How to reduce balance to 0?
      - Call `withdraw` function. The Fallback contract will send all the balance to you.
        ```shell
        await contract.withdraw()
        ```

****
   - By the way, on this topic, I have copied the Fallback contract from Ethernuat and prepared the configuration for deploying with Hardhat. So you can try to deploy and test Fallback contract. Please follow steps below.
     - Steps
       - Install packages
        ```
        npm install
        ```
       - Compile smart contract
        ```
        npx hardhat compile
        ```
       - Deploy smart contract
        ```
        npx hardhat run scripts/fallback.ts
        ```
        Ex.
        ```
        Fallback deployed to:  0x5FbDB2315678afecb367f032d93F642f64180aa3
        ```

       - Test smart contract
        ```
        npx hardhat test test/fallback.ts
        ```
        Ex.
        ```
          Fallback
                Deployment
                ✔ Should set the right owner (1040ms)
                Cliam owner and reduce balance to 0
                ✔ Should cliam owner and reduce balance to 0 (100ms)


        2 passing (1s)
        ```