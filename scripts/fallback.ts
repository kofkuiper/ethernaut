import { ethers } from "hardhat";

async function main() {
  const Fallback = await ethers.getContractFactory("Fallback");
  const fallback = await Fallback.deploy();
  await fallback.deployed();
  console.log('Fallback deployed to: ', fallback.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
