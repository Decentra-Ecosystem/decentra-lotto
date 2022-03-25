// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const isTest = false;
const hre = require("hardhat");

//npx hardhat run scripts/deploy_decentralotto.js --network bscMainNet
//npx hardhat verify "0x211CbDd36149B74AB618f05A311D69C326881a7C" --network bscMainNet
//deploy dapp with new contract
//call excludeFromReward with contract address
//call excludeFromFee with contract address
//call setLottoWallet with contract address
//add charity addresses:
//0xc44ff08425375097e4337b48151499280c25268c
//0xb5d85aa6d007a7ff18e649dfcf0fef772e93fe2d
//0x4E20b8bBA2636E44508B50FFa5286EB638cf0c5F
//0x1392b6937a4c09C6c92bf9eab3397e51b05F600e
//send LINK token
//call createNextDrawManual

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DecentraTokens = await hre.ethers.getContractFactory("DecentraLottoDraw");
  const decentraTokens = await DecentraTokens.deploy();

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
