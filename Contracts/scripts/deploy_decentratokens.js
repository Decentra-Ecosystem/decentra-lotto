// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
let args = require("../arguments_live.json");

//npx hardhat run scripts/deploy_decentratokens.js --network ethRinkeby
//npx hardhat verify "0x3EeAA98951d61d39a3B7ef654F89ec78B702564c" --constructor-args arguments.js --network ethRinkeby

//0.1. Update chainlink addresses and fee in contract
//0.2. Update arguments.js and arguments.json
//1. Call this
//2. Call distribute_tokens script
//3. Call Add liquidity script

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DecentraTokens = await hre.ethers.getContractFactory("DecentraTokens");
  const decentraTokens = await DecentraTokens.deploy(args[0], args[1], args[2], args[3], args[4], args[5]);

  await decentraTokens.deployed();

  console.log("DecentraTokens deployed to:", decentraTokens.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
