// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const args = require("../arguments/bridge/arguments_live_eth.json");

//update arguments_live_eth to delo eth
//npx hardhat run scripts/deploy_delo_bridge_eth.js --network ethMainNetBridge
//npx hardhat verify "0x14686EF6104DBBfAFecbC5a49ccfd10EAe63F876" --constructor-args "arguments/bridge/arguments_live_eth.js" --network ethMainNetBridge

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DecentraTokens = await hre.ethers.getContractFactory("Reserve");
  const decentraTokens = await DecentraTokens.deploy(args[0]);

  await decentraTokens.deployed();



  console.log("DecentraLotto deployed to:", decentraTokens.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
