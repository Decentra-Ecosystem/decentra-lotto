// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const isTest = true;
const hre = require("hardhat");
let abi = require("../artifacts/contracts/Decentra-Tokens.sol/DecentraTokens.json").abi;
let amount = 100000000000000; //1% of supply
let secrets = require("../secrets");

const address = '0xd38d1913799909158e319453ab315CAB1bEfb55c';

async function main() {
  if (address == ''){
    console.log("Address blank");
    return;
  }
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

  // "0xaa5f12E34Ed3121B36830FC8F09494dc37E4E595", //dre
  // "0x63Ce40890c0eFc7834ffaB463dAfEC9d2a486eAB", //ASD
  // "0xFD3A2CB6e651e3280a18d7DF1E16447e87a0D60a", //Liz
  // "0xe81BF6f580bd023517468A67D05777aE698F3882", //Arrjay
  // "0x978C5189073A046302314EE7BbAb3fF9e840ccae", //ropey
  // "0xFa6F7a8dE6ecBB9Efa330cC9765f9E35cD1c5A4C", //dan
  // "0xF8760DD2d6AC02275cb4d08B1b8335718FDf82be", //daniel(askey)
  // "0x03f4e3348f050D14FC88F0A6772660494D0e7027", //Lee
  // "0x063EF4446f0641F0B452f7C59e659DaD79FF25AB", //Jordan
  // "0x982bE252407D54C8df1B93caeD441bA7c6bE3e12", //Calypso
  // "0x86f6408de4e5a9510aac4b97142777c8ce3c023d", //Pepetron
  // "0x57f945C25C268219ea8a18eB79530E8A892c481C", //Celty - Alternate
  // "0xE01033d96A31B9Df6c78d284A05f428F020ab83D", //Satoshi
  // "0x417B5BF4CF974176C5b01b256F6d0EBd8e87adEe", //Celty Alternate 02

  var wallets = [
    "",
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
