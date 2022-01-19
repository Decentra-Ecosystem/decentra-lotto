// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const isTest = false;
const hre = require("hardhat");
let abi = require("../artifacts/contracts/Decentra-Tokens.sol/DecentraTokens.json").abi;
let amount = 3500000000000000; //35% of supply
let secrets = require("../secrets");

const address = '0xD29F40422fD95737750B0DE59800b302B18f6729';

async function main() {
  let apiKey;
  let deployerKey;
  let providerName;
  if (isTest == true){
    apiKey = secrets.rinkeyAPIKey;
    deployerKey = secrets.deployerPrivatekeyTest;
    providerName = "rinkeby";
  }else{
    apiKey = secrets.mainnetAPIKey;
    deployerKey = secrets.deployerPrivatekeyLive
    providerName = "homestead"
  }
  console.log("Setting up wallet...");
  const provider = new hre.ethers.providers.InfuraProvider(providerName, apiKey);
  var wallet  = new hre.ethers.Wallet(deployerKey, provider);
  console.log("Wallet setup complete...");
  decentraTokens = new hre.ethers.Contract(address,abi,wallet);
  console.log('Got deployed token.');
  
  console.log("");

  var wallets = [
    "0x000000000000000000000000000000000000dEaD", //dead
  ];

  var amounts = [];
  var total = new ethers.BigNumber.from(0);

  for (let i=0; i<wallets.length; i++){
    amounts[i] = new ethers.BigNumber.from(amount);
    total = total.add(amounts[i]);
  }

  console.log(wallets)
  console.log(amounts)

  console.log("Approving")
  var approveTx = await decentraTokens.approve(address, total);
  await approveTx.wait();
  console.log("Approved")

  console.log("Turning off swap and distribute") 
  var x = await decentraTokens.setSwapAndDistributeEnabled(false, {from: wallet.address});
  await x.wait();

  console.log("Sending")  
  var x = await decentraTokens.multiSender(wallets, amounts, {from: wallet.address});
  await x.wait();
  console.log("Tokens sent");

  console.log("Turning on swap and distribute") 
  var x = await decentraTokens.setSwapAndDistributeEnabled(true, {from: wallet.address});
  await x.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
