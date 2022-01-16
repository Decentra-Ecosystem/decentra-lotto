const { expect } = require("chai");
const { ethers } = require("hardhat");
let args = require(".././arguments/DFEG/arguments_test.json");
let abi = require("../artifacts/contracts/Decentra-Tokens.sol/DecentraTokens.json").abi;
let uniswapABI = require("../artifacts/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol/IUniswapV2Router02.json").abi;
let secrets = require("../secrets");

describe("DecentraTokens", function () {
  it("Will get the deployed token on Rinkeby, approve, add liquidity and do a test buy and sell", async function () {

    var lottoOn = false;
    var swapAndDistributeEnabled = true;

    //populate these if I want to start with a previously deployed token
    var startToken = '';

    console.log("Setting up...");
    const uniAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    const provider = new ethers.providers.InfuraProvider("rinkeby", secrets.rinkeyAPIKey);
    var now = new Date();
    var deadline = addHoursToDate(now, 1).getTime();
    var wallet  = new ethers.Wallet(secrets.deployerPrivatekeyTest, provider);
    var uniswap = new ethers.Contract(uniAddress,uniswapABI,wallet);

    console.log("");

    //jackpot token deployment and config
    var jackpotAddress = await deployFEG(abi, wallet, uniAddress, uniswap, deadline);

    var [decentraTokens, address] = await deployDFEG(abi, wallet, uniAddress, uniswap, deadline, startToken, jackpotAddress);

    if(lottoOn == false){
      console.log("Turning off draw...");
      var turnOffDraw = await decentraTokens.setLottoEnabled(false, {from: wallet.address});
      await turnOffDraw.wait();
      console.log("Draw off.");
    }
    if(swapAndDistributeEnabled == false){
      console.log("Turning off swapAndDistribute...");
      var turnOffDraw = await decentraTokens.setSwapAndDistributeEnabled(false, {from: wallet.address});
      await turnOffDraw.wait();
      console.log("swapAndDistribute off.");
    }

    // console.log("Sending tokens...");
    // var supply = await decentraTokens.totalSupply();
    // var amountToSend = supply.div(100).mul(1);
    // var send = await decentraTokens.transfer("0xe28AFA84EE9F43f93162b3502D78D010227a224B", amountToSend, {from: wallet.address});
    // await send.wait();
    // console.log("Tokens sent...");

    // console.log("Updating jackpot token to FEG...");
    // var updateJackpot = await decentraTokens.updateJackpotTokenAddress(jackpotAddress, 9, {from: wallet.address});
    // await updateJackpot.wait();
    // console.log("FEG is now the jackpot token...");
    //
    
    console.log("");
    console.log("Setup finished.");
    console.log("");

    //now we have liquidity added, we need a test buy and sell. First thing is to buy straight away an check if we were added as a sniper
    console.log("Setting up buyer wallet...");
    var buyerWallet  = new ethers.Wallet(secrets.test3Privatekey, provider);
    var buyerDecentraTokens = new ethers.Contract(address,abi,buyerWallet);
    var buyerUniswap = new ethers.Contract(uniAddress,uniswapABI,buyerWallet);
    console.log("Buyer wallet setup complete.");

    console.log("");

    var threshold = await decentraTokens.numTokensSellToDistribute();
    var current = 0;
    while (current < threshold){
      await buy(address, buyerWallet, buyerUniswap, buyerDecentraTokens, deadline);
      await sell(address, buyerWallet, buyerUniswap, buyerDecentraTokens, deadline, uniAddress);
      current = await decentraTokens.balanceOf(address);
    }

    console.log("Threshold reached");
    await buy(address, buyerWallet, buyerUniswap, buyerDecentraTokens, deadline);
    await sell(address, buyerWallet, buyerUniswap, buyerDecentraTokens, deadline, uniAddress);

    console.log("");

    // console.log("Snipers: " + await decentraTokens.snipersCaught());
    // var excludeSniper = await decentraTokens.excludeSniper(buyerWallet.address, {from: wallet.address});
    // await excludeSniper.wait();
    // console.log("Snipers: " + await decentraTokens.snipersCaught());
  });
});

async function sell(address, buyerWallet, buyerUniswap, buyerDecentraTokens, deadline, uniAddress){
  console.log("Checking allowance...");
  var weth = await buyerUniswap.WETH();
  var bal = await buyerDecentraTokens.balanceOf(buyerWallet.address);
  console.log("Approving sell amount...");
  var approveTx = await buyerDecentraTokens.approve(uniAddress, bal);
  await approveTx.wait();
  console.log("Approved.");
  console.log("Selling token...");
  var sellTx = await buyerUniswap.swapExactTokensForETHSupportingFeeOnTransferTokens(bal, 0, [address, weth], buyerWallet.address, deadline, {
    from: buyerWallet.address
  });
  // wait until the transaction is mined
  await sellTx.wait();
  var bal = await buyerDecentraTokens.balanceOf(buyerWallet.address);
  expect(bal).to.be.equal(0);
  console.log("Token sold.");
  console.log("");
}

async function buy(address, buyerWallet, buyerUniswap, buyerDecentraTokens, deadline){
  console.log("Checking balance...");
  var amountToBuyInEth = new ethers.BigNumber.from("100000000000000");
  var weth = await buyerUniswap.WETH();
  var bal = await buyerDecentraTokens.balanceOf(buyerWallet.address);
  if (bigNumToReadable(bal) == 0){
    console.log("Buying token...");
    var buyTx = await buyerUniswap.swapExactETHForTokensSupportingFeeOnTransferTokens(0, [weth, address], buyerWallet.address, deadline, {
      from: buyerWallet.address,
      value: amountToBuyInEth
    });
    // wait until the transaction is mined
    await buyTx.wait();
    console.log("Token bought.");
  }else{
    console.log("Balance already greater than zero.");
  }
  bal = await buyerDecentraTokens.balanceOf(buyerWallet.address);
  expect(bal).to.be.above(0);
  console.log("");
}

async function deployDFEG(abi, wallet, uniAddress, uniswap, deadline, startToken, jackpotAddress){
  var decentraTokens;
  var address;
  if(startToken != ''){
    address = startToken;
    console.log('Found deployed token at: ' + address + ' , getting it now...');
    decentraTokens = new ethers.Contract(address,abi,wallet);
    console.log('Got deployed token.');
  }else{
    console.log("Deploying DFEG token...");
    const DecentraTokensDeployer = await ethers.getContractFactory("DecentraTokens", wallet);
    const decentraTokensDeployer = await DecentraTokensDeployer.deploy(args[0], args[1], args[2], jackpotAddress, args[4], args[5]);
    await decentraTokensDeployer.deployed();
    decentraTokens = new ethers.Contract(decentraTokensDeployer.address,abi,wallet);
    address = decentraTokensDeployer.address;
    console.log("DFEG token deployed to:", address);
  }

  console.log("");

  //initial checks
  console.log("Starting initial checks...");
  //var flipSniper = await decentraTokens.setSniperProtection(false, {from: wallet.address});
  //await flipSniper.wait();
  expect(await decentraTokens.symbol()).to.equal("DFEG");
  console.log("Initial checks passed.");
  //

  console.log("");

  //check, approve, and add liquidity
  await addLiquidity(decentraTokens, wallet, uniAddress, uniswap, address, deadline, false);

  console.log("");

  return [decentraTokens, address]
}

async function deployFEG(abi, wallet, uniAddress, uniswap, deadline){
  console.log("Deploying FEG...");
  const Jackpot = await ethers.getContractFactory("FEG", wallet);
  const jackpot = await Jackpot.deploy();
  await jackpot.deployed();
  var jackpotAddress = jackpot.address;
  var jackpotContract = new ethers.Contract(jackpotAddress,abi,wallet);
  console.log("FEG deployed to:", jackpotAddress);

  console.log("");

  console.log("Adding liquidity to FEG...");
  await addLiquidity(jackpotContract, wallet, uniAddress, uniswap, jackpotAddress, deadline, true);
  console.log("Liquidity added to FEG.");

  console.log("");

  return jackpotAddress
}

async function addLiquidity(token, wallet, uniAddress, uniswap, address, deadline, isFEG) {
  var ownerBalance = await token.balanceOf(wallet.address);
  var supply = await token.totalSupply();
  var liquidityAdded;
  console.log("Checking liquidity...");
  if(isFEG){
    liquidityAdded = false;
  }else{
    liquidityAdded = await token._hasLiqBeenAdded();
  }
  if (!liquidityAdded){
    expect(supply).to.equal(ownerBalance);
    console.log("No liquidity detected, adding initial liquidity...");
    var liquidityAmt = supply.div(100).mul(40);
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
    let ethAmt = new ethers.BigNumber.from("10000000000000000");
    var liquidityTx = await uniswap.addLiquidityETH(address, liquidityAmt, 0, ethAmt, wallet.address, deadline, {
      from: wallet.address,
      value: ethAmt
    });
    // wait until the transaction is mined
    await liquidityTx.wait();
    if(!isFEG){
      var liqAdded = await token._hasLiqBeenAdded();
      console.log("Liq Added: " + liqAdded);
    }
    console.log("Liquidity added.");
  }else{
    console.log("Liquidity already added.");
  }
}

function addHoursToDate(date, hours) {
  return new Date(new Date(date).setHours(date.getHours() + hours));
}

function bigNumToReadable(num) {
  return ethers.utils.formatUnits(num, 9);
}
