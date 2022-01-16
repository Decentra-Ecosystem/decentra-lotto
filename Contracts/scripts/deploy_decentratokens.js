// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const isTest = true;
const hre = require("hardhat");
let args;
if (isTest){
  args = require(".././arguments/DFEG/arguments_test.json");
}else{
  args = require(".././arguments/DFEG/arguments_live.json");
}

//0.1. Update chainlink addresses and fee in contract
//0.2. Update arguments.js and arguments.json
//1. Call this
//2. Call distribute_tokens script
//3. Call Add liquidity script

//npx hardhat run scripts/deploy_decentratokens.js --network ethRinkeby
//npx hardhat verify "0xCb2d85E6057c625a7e3545C1a8A1d37D1f4f08D6" --constructor-args "arguments/DFEG/arguments_test.js" --network ethRinkeby
//npx hardhat run scripts/distribute_decentratokens.js --network ethRinkeby

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
