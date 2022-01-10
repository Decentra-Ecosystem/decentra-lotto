// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const args = [    
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    "0x15E3B0a44e5d80Df5a97da0CdFd51598475cd181",
    "0xe28AFA84EE9F43f93162b3502D78D010227a224B",
    "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b", 
    6, 
    200
  ];

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
