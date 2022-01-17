// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const isTest = true;
const hre = require("hardhat");
let abi = require("../artifacts/contracts/Decentra-Tokens.sol/DecentraTokens.json").abi;
let uniswapABI = require("../artifacts/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol/IUniswapV2Router02.json").abi;
let secrets = require("../secrets");

const address = '0xAAd765909cC7149a55e362095446144F2CA5C13E';
const amtETH = '10000000000000000'; //0.01eth
const tokenPercentsupply = 40; //40%

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
    apiKey = secrets.urlETHMainNet;
    deployerKey = secrets.deployerPrivatekeyLive
    providerName = homestead
  }
  console.log("Setting up wallet...");
  const uniAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const provider = new hre.ethers.providers.InfuraProvider(providerName, apiKey);
  var now = new Date();
  var deadline = addHoursToDate(now, 1).getTime();
  var wallet  = new hre.ethers.Wallet(deployerKey, provider);
  var uniswap = new hre.ethers.Contract(uniAddress,uniswapABI,wallet);
  console.log("Wallet setup complete...");
  
  console.log("");

  decentraTokens = new hre.ethers.Contract(address,abi,wallet);
  console.log('Got deployed token.');

  await addLiquidity(decentraTokens, wallet, uniAddress, uniswap, address, deadline)

}

async function addLiquidity(token, wallet, uniAddress, uniswap, address, deadline) {
  var ownerBalance = await token.balanceOf(wallet.address);
  var supply = await token.totalSupply();
  var liquidityAdded = await token._hasLiqBeenAdded();
  console.log("Checking liquidity...");
  if (!liquidityAdded){
    expect(supply).to.equal(ownerBalance);
    console.log("No liquidity detected, adding initial liquidity...");
    var liquidityAmt = supply.div(100).mul(tokenPercentsupply);
    var allowance = await token.allowance(wallet.address, uniAddress);
    
    if (allowance < liquidityAmt){
      console.log("Approving Uniswap...");
      var approveTx = await token.approve(uniAddress, liquidityAmt);
      await approveTx.wait();
  
      expect(await token.allowance(wallet.address, uniAddress)).to.equal(liquidityAmt);
      console.log("Uniswap Approved.");
    }else{
      console.log("Uniswap already approved for liquidity amount.");
    }
    //

    //add liquidity
    console.log("Adding liquidity...");
    let ethAmt = new hre.ethers.BigNumber.from(amtETH);
    var liquidityTx = await uniswap.addLiquidityETH(address, liquidityAmt, 0, ethAmt, wallet.address, deadline, {
      from: wallet.address,
      value: ethAmt
    });
    // wait until the transaction is mined
    await liquidityTx.wait();
    var liqAdded = await token._hasLiqBeenAdded();
    console.log("Liq Added: " + liqAdded);
  }else{
    console.log("Liquidity already added.");
  }
}

function addHoursToDate(date, hours) {
  return new Date(new Date(date).setHours(date.getHours() + hours));
}

function bigNumToReadable(num) {
  return hre.ethers.utils.formatUnits(num, 9);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
