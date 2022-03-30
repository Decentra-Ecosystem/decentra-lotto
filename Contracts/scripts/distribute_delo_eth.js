// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const isTest = true;
const hre = require("hardhat");
let abi = require("../artifacts/contracts/DELO_ETH.sol/DecentraLottoETH.json").abi;
let amount = 100000000000000; //1% of supply
let secrets = require("../secrets");

const address = '';

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
  var wallets = [
    "0x164FB22c9c06e275E4950ED8934046da0C202D42",
    "0xCF74cbC40b4b54Ae3F4fF778583d9A0BecD98Ebe",
    "0x5b642730c0AEF75DBE14B8041D954ea96e81cA54",
    "0xA5280b7454ca2B5F429657B7210B211AB2c20128",
    "0x61Fb72ACc88c8a0c4E9312ffFA5Ea5Fb87f43c72",
    "0x45B16CC60331F7aA5f3c86101Ea36EB0DB367F95",
    "0xB904675a0931722322237CE730f285A01FD9Db05",
    "0x44d92694fD5b9dD168c52408C66d5C65412E1558",
    "0x91C47d2b22ADba742e2D27ff9D49e5beBC0F43B5",
    "0xfa56A49759592f2E1AEe5B2213634f06C5D0Ed28",
    "0x3Ca6e6263b8Fae0476eA85379186661FBCd0a008",
    "0x237710Aab109c1d0C506DD9Ec3276722A8eF196E",
    "0xc2A501A9401E18345BaBbec1F4dB98C8D163DA3c",
    "0x982bE252407D54C8df1B93caeD441bA7c6bE3e12",
    "0xb242949568cceda02c348db6239b3De9700cA40C",
    "0xf20275A2135bE162a4b706D926FC9033Be3a9284",
    "0x7F423aDE7B35b70FDB60f1C15d406EDe1D9c82cb",
    "0x90b3Aaca3b7C00217AC212616Ed577ED2353E76d",
    "0xE08B86a5059C07ff272179ef0f4f165b9ac64331",
    "0x82A180fA860a73D50f39e8b25CAaFB097Ab2336F",
    "0x33f704c20bFf1f789578BDA8ef1D5aD7BED76898",
    "0x2A6E571a96bF41Fe3c51008bb83fDC3962603101",
    "0xF8760DD2d6AC02275cb4d08B1b8335718FDf82be",
    "0xcba8F6c28F12b7C294de631854666cD5038c058e",
    "0xB33938931cF7a8973E2960D60C8991F24CD7274C",
    "0x9E83B9aD97424478a523f5b2a3964959Db18050d",
    "0x02067b429D546096cfC98b94cB26CdaEBEa16315",
    "0xB86E4Af60Bc29fB297a1A1a571A949848D519D14",
    "0x978C5189073A046302314EE7BbAb3fF9e840ccae",
    "0xd75ceF54E2c64661A46b76619Ea5ad593952ddC0",
    "0xc3fAebBeFac47f7037345e1aaB31F0856DB31D00",
    "0x86f6408de4e5a9510aac4b97142777c8ce3c023d",
    "0x82B2280Cb6EAc0a146Eff4044796407410dC613A",
    "0xa71877a3eE0A2df22187be358785B29B3d82b077",
    "0x7B85C611580E4DFA973eF29f490E68e4dce4e6b0",
    "0x57f945C25C268219ea8a18eB79530E8A892c481C",
    "0x7443c6688469254FfC8EF5eAEEb21AD6B8e0ad19",
    "0x6cdABBd232Eb4104460576355F2C2A7ADDBd3D07",
    "0x63Ce40890c0eFc7834ffaB463dAfEC9d2a486eAB",
    "0x8a73ff50E80B65b9693e6E51a051bC018CbE0ACD",
    "0x0685740176dE70D4fadd4EC7831DA2a785326453"
  ];

  var amountsRaw = [
    54038785612204,
    156877359797228,
    158228642432630,
    176031620408063,
    208245000000000,
    322176381833069,
    364624390973616,
    393714567729918,
    405000000000000,
    941046334817602,
    1196821462527880,
    1356919036134340,
    1648333296872430,
    1761040982354210,
    2110173619073790,
    3375000000000000,
    4295961896044910,
    6008804706499420,
    7067637557912360,
    7108735091902760,
    8510213852589190,
    11805315790752900,
    12900000000000000,
    14688846449642500,
    15000000000000000,
    15752399984269500,
    18434330707589700,
    33305521213986800,
    33326774058989900,
    33489219656306100,
    41342494342852500,
    49737187050000000,
    57341260950000100,
    59020811400329900,
    69691500150000100,
    74042700225278300,
    74952162123418600,
    81031848716562200,
    80000000000000000,
    80000000000000000,
    80000000000000000
  ]

  var amounts = [];
  var total = new ethers.BigNumber.from(0);

  for (let i=0; i<wallets.length; i++){
    amounts[i] = new ethers.BigNumber.from(amountsRaw[i]);
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
