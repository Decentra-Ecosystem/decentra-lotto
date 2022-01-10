// pragma solidity ^0.6.12;
// pragma experimental ABIEncoderV2;

// // SPDX-License-Identifier: Unlicensed

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/utils/Context.sol";
// import "@openzeppelin/contracts/utils/Address.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
// import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol';
// import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
// import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";



// //DecentraLotto Interface
// interface IDecentraLotto {
//   function CHARITY_WALLET (  ) external view returns ( address );
//   function _burnFee (  ) external view returns ( uint256 );
//   function _charityFee (  ) external view returns ( uint256 );
//   function _liquidityFee (  ) external view returns ( uint256 );
//   function _maxTxAmount (  ) external view returns ( uint256 );
//   function _previousCharityFee (  ) external view returns ( uint256 );
//   function _tBurnTotal (  ) external view returns ( uint256 );
//   function _taxFee (  ) external view returns ( uint256 );
//   function allowance ( address owner, address spender ) external view returns ( uint256 );
//   function approve ( address spender, uint256 amount ) external returns ( bool );
//   function balanceOf ( address account ) external view returns ( uint256 );
//   function buybackBurn ( uint256 amount ) external;
//   function decimals (  ) external pure returns ( uint8 );
//   function decreaseAllowance ( address spender, uint256 subtractedValue ) external returns ( bool );
//   function excludeFromFee ( address account ) external;
//   function excludeFromReward ( address account ) external;
//   function geUnlockTime (  ) external view returns ( uint256 );
//   function includeInFee ( address account ) external;
//   function includeInReward ( address account ) external;
//   function increaseAllowance ( address spender, uint256 addedValue ) external returns ( bool );
//   function isExcludedFromFee ( address account ) external view returns ( bool );
//   function isExcludedFromReward ( address account ) external view returns ( bool );
//   function lock ( uint256 time ) external;
//   function name (  ) external pure returns ( string memory );
//   function owner (  ) external view returns ( address );
//   function reflectionFromToken ( uint256 tAmount, bool deductTransferFee ) external view returns ( uint256 );
//   function renounceOwnership (  ) external;
//   function setCharityFeePercent ( uint256 charityFee ) external;
//   function setCharityWallet ( address _charityWallet ) external;
//   function setLiquidityFeePercent ( uint256 liquidityFee ) external;
//   function setMaxTxPercent ( uint256 maxTxPercent ) external;
//   function setRouterAddress ( address newRouter ) external;
//   function setSwapAndLiquifyEnabled ( bool _enabled ) external;
//   function setTaxFeePercent ( uint256 taxFee ) external;
//   function swapAndLiquifyEnabled (  ) external view returns ( bool );
//   function symbol (  ) external pure returns ( string memory );
//   function tokenFromReflection ( uint256 rAmount ) external view returns ( uint256 );
//   function totalDonated (  ) external view returns ( uint256 );
//   function totalFees (  ) external view returns ( uint256 );
//   function totalSupply (  ) external view returns ( uint256 );
//   function transfer ( address recipient, uint256 amount ) external returns ( bool );
//   function transferFrom ( address sender, address recipient, uint256 amount ) external returns ( bool );
//   function transferOwnership ( address newOwner ) external;
//   function uniswapV2Pair (  ) external view returns ( address );
//   function uniswapV2Router (  ) external view returns ( address );
//   function unlock (  ) external;
//   function withdrawEth ( uint256 amount ) external;
// }

// interface IDELOStaking {
//     function ADDFUNDS(uint256 tokens) external;
// }

// abstract contract RandomNumberConsumer is VRFConsumerBase {
    
//     bytes32 internal keyHash;
//     uint256 internal fee;
    
//     uint256 public randomResult;
    
//     //contracts: https://docs.chain.link/docs/vrf-contracts/
//     //faucets: https://docs.chain.link/docs/link-token-contracts/
//     constructor(address _vrfCoordinator, address _link, bytes32 _keyHash, uint256 _fee) 
//         VRFConsumerBase(
//             _vrfCoordinator, // VRF Coordinator
//             _link  // LINK Token
//         ) public
//     {
//         keyHash = _keyHash;
//         fee = _fee; // 0.1 LINK for testnet, 0.2 LINK for Live (Varies by network)
//     }
    
//     /** 
//      * Requests randomness 
//      */
//     function getRandomNumber() internal returns (bytes32 requestId) {
//         require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
//         return requestRandomness(keyHash, fee);
//     }
// }

// contract DrawInterface {
//     struct NewDraw {
//         uint256 id;
//         uint32 numParticipants;
//         uint32 numTickets;
//         address[] winners;
//         mapping (uint256 => address) tickets;
//         mapping (address => uint256) walletSpendBNB;
//         mapping (address => uint16) walletNumTickets;
//         mapping (address => uint256) walletWinAmount;
//         // A unix timestamp, denoting the created datetime of this draw
//         uint256 createdOn;
//         // A unix timestamp, denoting the end of the draw
//         uint256 drawDeadline;
//         uint256 totalPot;
//         LotteryState state;
//     }  
    
//     enum LotteryState{
//         Open,
//         Closed,
//         Ready,
//         Finished
//     }
// }

// contract DecentraLottoDraw is Context, Ownable, RandomNumberConsumer, DrawInterface {
//     using Address for address;
    
//     IERC20 weth;
//     IDecentraLotto delo;
//     IDELOStaking deloStaking;
    
//     address public deloAddress = 0xC91B4AA7e5C247CB506e112E7FEDF6af7077b90A;
//     address public deloStakingAddress = 0xd06e418850Cc6a29a9e8a99ddb8304730367b55D;
//     address public peg = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56; // busd
//     address public wethAddress = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c; //wbnb
//     address public megadrawWallet = 0x1e714e7DAAb6886920726059960b4A8f68F319e8;
    
//     mapping (address => bool) public stablesAccepted;
    
//     uint256 public drawLength;
//     mapping (uint16 => NewDraw) public draws;
//     uint16 public currentDraw = 0;

//     mapping (address => uint16) private walletTotalTicketsPurchased;
    
//     mapping (address => uint16) private walletTotalWins;
//     mapping (address => uint256) private walletTotalWinValueDelo;
    
//     mapping (address => uint16) private walletTotalCharityTickets;
//     mapping (address => uint256) private totalAirdropsReceived;
    
//     mapping (address => bool) public charityRecipients;

//     uint256 public priceOneTicket = 10 *10**18;
//     uint8 public maxTicketsPerTxn = 60;
//     uint8 public discountFiveTickets = 5;
//     uint8 public discountTenTickets = 10;
//     uint8 public discountTwentyTickets = 20;
    
//     uint8 public liquidityDivisor = 20; //5%
//     uint8 public marketingDivisor = 10; //10%
//     uint8 public hedgeDivisor = 10; //10%
//     uint8 public stakingDivisor = 5; //20%
//     uint8 public megadrawDivisor = 20; //5%
//     bool public takeLiquidity = true;
//     bool public takeMarketing = false;
//     bool public takeHedge = true;
//     bool public takeStaking = true;
//     bool public takeMegadraw = true;
    
//     bool public stopNextDraw = false;
//     uint public maxWinners = 40;
//     bytes32 private requestId;
    
//     IUniswapV2Router02 public uniswapV2Router;
//     bool private inSwapAndLiquify;

//     constructor () 
//         RandomNumberConsumer(
//             0x747973a5A2a4Ae1D3a8fDF5479f1514F65Db9C31, //vrfCoordinator
//             0x404460C6A5EdE2D891e8297795264fDe62ADBB75, //link address
//             0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c, //key hash
//             0.2 * 10 ** 18 //fee
//         ) public {
//         uniswapV2Router = IUniswapV2Router02(0x10ED43C718714eb63d5aA57B78B54704E256024E);
//         delo = IDecentraLotto(deloAddress);
//         deloStaking = IDELOStaking(deloStakingAddress);
//         weth = IERC20(wethAddress);
//         drawLength = 1 * 1 weeks;
//         stablesAccepted[0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56] = true; //busd
//         stablesAccepted[0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3] = true; //dai
//         stablesAccepted[0x55d398326f99059fF775485246999027B3197955] = true; //usdt
//         stablesAccepted[0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d] = true; //usdc
        
//         //change state to finished
//         _changeState(LotteryState.Finished);
//     }
    
//     event LotteryStateChanged(LotteryState newState);
    
//     event SwapAndLiquify(
//         uint256 tokensSwapped,
//         uint256 ethReceived,
//         uint256 tokensIntoLiquidity
//     );
    
//     event TicketsBought(address indexed user, uint256 amount);
//     event GetRandom(bytes32 requestId);
//     event GotRandom(uint256 randomNumber);
//     event WinnerPaid(address indexed user, uint256 amount);
//     event DrawCreated(uint256 id);
    
//     modifier isState(LotteryState _state){
//         NewDraw storage draw = draws[currentDraw];
//         require(draw.state == _state, "Wrong state for this action");
//         _;
//     }
    
//     modifier lockTheSwap {
//         inSwapAndLiquify = true;
//         _;
//         inSwapAndLiquify = false;
//     }
    
//     //@dev - a failsafe just in case the state is stuck somewhere and we need to re-trigger the drawWinners()
//     function changeStateEmergency(LotteryState _newState) external onlyOwner {
//         NewDraw storage draw = draws[currentDraw];
//         draw.state = _newState;
//         emit LotteryStateChanged(draw.state);
//     }
    
//     function _changeState(LotteryState _newState) private {
//         NewDraw storage draw = draws[currentDraw];
//         draw.state = _newState;
//         emit LotteryStateChanged(draw.state);
//     }
    
//     function setStopNextDraw(bool _stopNextDraw) external onlyOwner{
//         stopNextDraw = _stopNextDraw;
//     }
    
//     function setMaxTicketsPerTxn(uint8 _maxTicketsPerTxn) external onlyOwner{
//         maxTicketsPerTxn = _maxTicketsPerTxn;
//     }
    
//     function setMaxWinners(uint amt) external onlyOwner{
//         maxWinners = amt;
//     }
    
//     function setMegadrawWallet(address _address) external onlyOwner{
//         megadrawWallet = _address;
//     }
    
//     function setDeloStakingAddress(address _address) external onlyOwner{
//         deloStakingAddress = _address;
//         deloStaking = IDELOStaking(deloStakingAddress);
//     }
    
//     function setPegAddress(address _address) external onlyOwner{
//         peg = _address;
//     }
    
//     function setWETHAddress(address _address) external onlyOwner{
//         wethAddress = _address;
//     }
    
//     function setRouterAddress(address newRouter) external onlyOwner() {
//         IUniswapV2Router02 _newPancakeRouter = IUniswapV2Router02(newRouter);
//         uniswapV2Router = _newPancakeRouter;
//     }
    
//     function setTicketPrice(uint256 _priceOneTicket) external onlyOwner{
//         priceOneTicket = _priceOneTicket;
//     }
    
//     function setDiscounts(uint8 _discountFiveTickets, uint8 _discountTenTickets, uint8 _discountTwentyTickets) external onlyOwner{
//         discountFiveTickets = _discountFiveTickets;
//         discountTenTickets = _discountTenTickets;
//         discountTwentyTickets = _discountTwentyTickets;
//     }
    
//     function addCharityRecipient(address _charity) external onlyOwner{
//         charityRecipients[_charity] = true;
//     }
    
//     function removeCharityRecipient(address _charity) external onlyOwner{
//         charityRecipients[_charity] = false;
//     }
    
//     function setLiquidityDivisor(uint8 _liqdiv) external onlyOwner{
//         liquidityDivisor = _liqdiv;
//     }
    
//     function setMarketingDivisor(uint8 _markdiv) external onlyOwner{
//         require(_markdiv >= 5, "Cannot set over 20% marketing allocation");
//         marketingDivisor = _markdiv;
//     }
    
//     function setHedgeDivisor(uint8 _hedgediv) external onlyOwner{
//         hedgeDivisor = _hedgediv;
//     }
    
//     function setStakingDivisor(uint8 _stakingdiv) external onlyOwner{
//         stakingDivisor = _stakingdiv;
//     }
    
//     function setMegadrawDivisor(uint8 _megadrawDivisor) external onlyOwner{
//         megadrawDivisor = _megadrawDivisor;
//     }
    
//     function toggleTakeLiquidity(bool _liq) external onlyOwner{
//         takeLiquidity = _liq;
//     }
    
//     function toggleTakeMarketing(bool _mark) external onlyOwner{
//         takeMarketing = _mark;
//     }
    
//     function toggleTakeHedge(bool _hedge) external onlyOwner{
//         takeHedge = _hedge;
//     }
    
//     function toggleTakeStaking(bool _takeStaking) external onlyOwner{
//         takeStaking = _takeStaking;
//     }
    
//     function toggleTakeMegadraw(bool _takeMegadraw) external onlyOwner{
//         takeMegadraw = _takeMegadraw;
//     }
    
//     function removeStablePayment(address _stable) external onlyOwner{
//         stablesAccepted[_stable] = false;
//     }
    
//     //withdraw dust
//     function withdrawBNB(uint256 amount) external onlyOwner {
//         msg.sender.transfer(amount);
//     }
    
//     //withdraw token link or trapped tokens
//     function withdrawToken(address _address, uint256 amount) external onlyOwner {
//         // Ensure requested tokens isn't DELO (cannot withdraw the pot)
//         require(_address != deloAddress, "Cannot withdraw Lottery pot");
//         IERC20 token = IERC20(_address);
//         token.transfer(msg.sender, amount);
//     }
    
//     function setDrawLength(uint multiplier, uint unit) external onlyOwner returns(bool){
//         if (unit == 1){
//             drawLength = multiplier * 1 seconds;
//         }else if (unit == 2){
//             drawLength = multiplier * 1 minutes;
//         }else if (unit == 3){
//             drawLength = multiplier * 1 hours;
//         }else if (unit == 4){
//             drawLength = multiplier * 1 days;
//         }else if (unit == 5){
//             drawLength = multiplier * 1 weeks;
//         }
        
//         return true;
//     }
    
//     function updateLengthOfCurrentDraw(uint multiplier, uint unit) external onlyOwner returns(bool){
//         NewDraw storage draw = draws[currentDraw];
//         uint dlen;
//         if (unit == 1){
//             dlen = multiplier * 1 seconds;
//         }else if (unit == 2){
//             dlen = multiplier * 1 minutes;
//         }else if (unit == 3){
//             dlen = multiplier * 1 hours;
//         }else if (unit == 4){
//             dlen = multiplier * 1 days;
//         }else if (unit == 5){
//             dlen = multiplier * 1 weeks;
//         }
//         draw.drawDeadline = draw.createdOn + dlen;
//         return true;
//     }
    
//     function getWalletWinAmountForDraw(uint16 _id, address winner) external view returns(uint){
//         NewDraw storage draw = draws[_id];
//         return draw.walletWinAmount[winner];
//     }
    
//     function getDrawStats(uint16 _id) external view returns(uint, uint, address[] memory, uint256, uint256, uint256, uint256, LotteryState, uint){
//         NewDraw storage draw = draws[_id];
//         return (
//             draw.id, 
//             draw.numParticipants, 
//             draw.winners,
//             draw.numTickets, 
//             draw.createdOn, 
//             draw.drawDeadline,
//             draw.totalPot,
//             draw.state,
//             getNumberWinners()
//         );
//     }
    
//     function getDrawStats() external view returns(uint, uint, address[] memory, uint256, uint256, uint256, uint256, LotteryState, uint){
//         NewDraw storage draw = draws[currentDraw];
//         return (
//             draw.id, 
//             draw.numParticipants, 
//             draw.winners,
//             draw.numTickets, 
//             draw.createdOn, 
//             draw.drawDeadline, 
//             draw.totalPot,
//             draw.state,
//             getNumberWinners()
//         );
//     }
    
//     function getDrawWalletStats(uint16 _id) external view returns (uint, uint, uint256, uint256, uint256, uint256, uint256){
//         NewDraw storage draw = draws[_id];
//         return (
//             draw.walletSpendBNB[msg.sender], 
//             draw.walletNumTickets[msg.sender],
//             walletTotalTicketsPurchased[msg.sender],
//             walletTotalWins[msg.sender],
//             walletTotalWinValueDelo[msg.sender],
//             walletTotalCharityTickets[msg.sender],
//             totalAirdropsReceived[msg.sender]
//         );
//     }
    
//     function getDrawWalletStats() external view returns (uint, uint, uint256, uint256, uint256, uint256, uint256){
//         NewDraw storage draw = draws[currentDraw];
//         return (
//             draw.walletSpendBNB[msg.sender], 
//             draw.walletNumTickets[msg.sender],
//             walletTotalTicketsPurchased[msg.sender],
//             walletTotalWins[msg.sender],
//             walletTotalWinValueDelo[msg.sender],
//             walletTotalCharityTickets[msg.sender],
//             totalAirdropsReceived[msg.sender]
//         );
//     }
    
//     function getCurrentPot() public view returns(uint256){
//         uint256 deloBal = delo.balanceOf(address(this));
//         return deloBal - deloBal.div(liquidityDivisor) - deloBal.div(megadrawDivisor);
//     }
    
//     // to be able to manually trigger the next draw if the previous one was stopped
//     function createNextDrawManual() external onlyOwner returns(bool){
//         NewDraw storage draw = draws[currentDraw];
//         require(draw.state == LotteryState.Finished, 'Cannot create new draw until winners drawn from previous.');
//         return createNextDraw();
//     }
    
//     function createNextDraw() private returns(bool){
//         currentDraw = currentDraw + 1;
//         NewDraw storage draw = draws[currentDraw];
//         draw.id = currentDraw;
//         draw.numTickets = 0;
//         draw.createdOn = now;
//         draw.drawDeadline = draw.createdOn + drawLength;
//         draw.numParticipants = 0;
//         _changeState(LotteryState.Open);
//         emit DrawCreated(draw.id);
//     }
    
//     function getNumberWinners() public view returns(uint){
//         uint numWinners = 0;
//         uint256 deloCost = getTicketCostInDelo();
//         uint256 bal = delo.balanceOf(address(this)).div(2);
//         while (bal >= deloCost && numWinners <= maxWinners){
//             bal = bal.sub(bal.div(2));
//             numWinners++;
//         }
//         return numWinners;
//     }
    
//     function drawWinners() public isState(LotteryState.Ready) returns(bool){
//         NewDraw storage draw = draws[currentDraw];
        
//         _changeState(LotteryState.Finished);

//         //seed for abi encoding random number
//         uint seed = 1;
        
//         //only execute while the winning amount * 2 is more than the balance
//         uint256 deloCost = getTicketCostInDelo();
        
//         draw.totalPot = delo.balanceOf(address(this));
        
//         while (delo.balanceOf(address(this)).div(2) >= deloCost && seed <= maxWinners){
//             //pick a random winner
//             address winner = draw.tickets[(uint256(keccak256(abi.encode(randomResult, seed))).mod(draw.numTickets))];
//             //add them to the winners array
//             draw.winners.push(winner);
//             //increment their wins
//             walletTotalWins[winner]++;
//             //add their win value
//             uint256 amt = delo.balanceOf(address(this)).div(2);
//             walletTotalWinValueDelo[winner] += amt;
//             draw.walletWinAmount[winner] += amt;
//             //transfer their winnings
//             delo.transfer(winner, amt);
//             //increment the seed
//             seed = seed + 1;
//             emit WinnerPaid(winner, amt);
//         }
        
//         randomResult = 0;

//         if (stopNextDraw == false){
//             createNextDraw();
//         }
//     }
    
//     /**
//         * Callback function used by VRF Coordinator
//     */
//     function fulfillRandomness(bytes32 _requestId, uint256 randomness) internal override {
//         require (requestId == _requestId, "requestId doesn't match");
        
//         randomResult = randomness;
        
//         _changeState(LotteryState.Ready);
        
//         emit GotRandom(randomResult);
//     }
    
//     function endDrawAndGetRandom() external isState(LotteryState.Open) returns(bool){
//         NewDraw storage draw = draws[currentDraw];
//         require (now > draw.drawDeadline, 'Draw deadline not yet reached');
        
//         _changeState(LotteryState.Closed);
        
//         //take liquidityDivisor of the total jackpot and add it to liquidity of the DELO token
//         uint256 jackpotTotal = delo.balanceOf(address(this));
//         if (takeLiquidity == true && inSwapAndLiquify == false){
//             //% to liquidity
//             swapAndLiquify(jackpotTotal.div(liquidityDivisor));
//         }
        
//         //take themegadraw allotment
//         if (takeMegadraw == true){
//             //take megadraw % to be accumulated for megadraws
//             delo.transfer(megadrawWallet, jackpotTotal.div(megadrawDivisor));
//         }
        
//         //get random number
//         requestId = getRandomNumber();
        
//         GetRandom(requestId);
        
//         return true;
//     }
    
//     function getPriceForTickets(address tokenAddress, uint numTickets) public view returns(uint256){
//         uint256 cost = 0;
//         uint256 price;
//         if (numTickets >= 20){
//             price = priceOneTicket - priceOneTicket.mul(discountTwentyTickets).div(100);
//         }else if(numTickets >= 10){
//             price = priceOneTicket - priceOneTicket.mul(discountTenTickets).div(100);
//         }else if(numTickets >= 5){
//             price = priceOneTicket - priceOneTicket.mul(discountFiveTickets).div(100);
//         }else{
//             price = priceOneTicket;
//         }
        
//         //returns the amount of bnb needed
//         if (tokenAddress == uniswapV2Router.WETH()){
//             address[] memory path = new address[](2);
//             path[0] = uniswapV2Router.WETH();
//             path[1] = peg;
//             uint256[] memory amountIn = uniswapV2Router.getAmountsIn(price, path);
//             cost = amountIn[0] * numTickets;
//         }else{
//             if (stablesAccepted[tokenAddress] == true){
//                 cost = price * numTickets;
//             }else{
//                 revert('Stable not accepted as payment');
//             }
//         }
//         return cost;
//     }
    
//     function getDELOValueInPeg(uint256 amt) external view returns(uint256[] memory){
//         address[] memory path = new address[](3);
//         path[0] = deloAddress;
//         path[1] = uniswapV2Router.WETH();
//         path[2] = peg;
//         uint256[] memory amountOut = uniswapV2Router.getAmountsOut(amt, path);
//         return amountOut;
//     }
    
//     function getDELOValueInBNB(uint256 amt) external view returns(uint256[] memory){
//         address[] memory path = new address[](2);
//         path[0] = deloAddress;
//         path[1] = uniswapV2Router.WETH();
//         uint256[] memory amountOut = uniswapV2Router.getAmountsOut(amt, path);
//         return amountOut;
//     }
    
//     function getBNBValueInDelo(uint256 amt) external view returns(uint256[] memory){
//         address[] memory path = new address[](2);
//         path[0] = uniswapV2Router.WETH();
//         path[1] = deloAddress;
//         uint256[] memory amountOut = uniswapV2Router.getAmountsOut(amt, path);
//         return amountOut;
//     }
    
//     function getPEGValueInDelo(uint256 amt) external view returns(uint256[] memory){
//         address[] memory path = new address[](3);
//         path[0] = peg;
//         path[1] = uniswapV2Router.WETH();
//         path[2] = deloAddress;
//         uint256[] memory amountOut = uniswapV2Router.getAmountsOut(amt, path);
//         return amountOut;
//     }
    
//     function getTicketCostInDelo() public view returns(uint256){
//         address[] memory path = new address[](3);
//         path[0] = deloAddress;
//         path[1] = uniswapV2Router.WETH();
//         path[2] = peg;
//         uint256[] memory amountIn = uniswapV2Router.getAmountsIn(priceOneTicket, path);
//         return amountIn[0];
//     }
    
//     function buyTicketsBNB(uint16 numTickets, address recipient, address airDropRecipient) payable external isState(LotteryState.Open) returns(bool){
//         NewDraw storage draw = draws[currentDraw];
//         require (now < draw.drawDeadline, 'Ticket purchases have ended for this draw');
//         require (recipient != address(0), 'Cannot buy a ticket for null address');
//         require (numTickets <= maxTicketsPerTxn, 'You are trying to buy too many tickets in this TXN');
        
//         uint256 cost = getPriceForTickets(wethAddress, numTickets);
//         require (msg.value >= cost, 'Insufficient amount. More BNB required for purchase.');
        
//         processTransaction(cost, numTickets, recipient, airDropRecipient);
        
//         //refund any excess
//         msg.sender.transfer(msg.value - cost);
        
//         return true;
//     }
    
//     //approve must first be called by msg.sender
//     function buyTicketsStable(address tokenAddress, uint16 numTickets, address recipient, address airdropRecipient) isState(LotteryState.Open) external returns(bool){
//         NewDraw storage draw = draws[currentDraw];
//         require (now < draw.drawDeadline, 'Ticket purchases have ended for this draw');
//         require (recipient != address(0), 'Cannot buy a ticket for null address');
//         require (numTickets <= maxTicketsPerTxn, 'You are trying to buy too many tickets in this TXN');
        
//         uint256 price = getPriceForTickets(tokenAddress, numTickets);
        
//         require (price > 0, 'Unsupported token provided as payment');
            
//         IERC20 token = IERC20(tokenAddress);
        
//         require(token.allowance(msg.sender, address(this)) >= price, "Check the token allowance");
//         require(token.balanceOf(msg.sender) >= price, "Insufficient balance");
        
//         uint256 initialTokenBal = token.balanceOf(address(this));
//         token.transferFrom(msg.sender, address(this), price);
//         uint256 tokenAmount = token.balanceOf(address(this)).sub(initialTokenBal);
            
//         uint bnbValue = 0;
        
//         // capture the contract's current ETH balance.
//         // this is so that we can capture exactly the amount of ETH that the
//         // swap creates, and not make the event include any ETH that
//         // has been manually sent to the contract
//         uint256 initialBalance = address(this).balance;
        
//         swapTokensForEth(tokenAddress, tokenAmount);
        
//         // how much ETH did we just swap into?
//         uint256 newBalance = address(this).balance.sub(initialBalance);
        
//         bnbValue = newBalance;
        
//         return processTransaction(bnbValue, numTickets, recipient, airdropRecipient);
//     }
    
//     function assignTickets(uint256 bnbValue, uint16 numTickets, address receiver) isState(LotteryState.Open) private returns(bool){
//         NewDraw storage draw = draws[currentDraw];
//         //only add a new participant if the wallet has not purchased a ticket already
//         if (draw.walletNumTickets[receiver] <= 0){
//             draw.numParticipants++;
//         }
        
//         //add the wallet for each ticket they purchased
//         uint32 num = draw.numTickets;
//         for (uint i=0; i < numTickets; i++){
//             draw.tickets[num] = receiver;
//             num += 1;
//         }
//         draw.numTickets = num;
//         draw.walletNumTickets[receiver] += numTickets;
//         walletTotalTicketsPurchased[receiver] += numTickets;
        
//         draw.walletSpendBNB[receiver] += bnbValue;
//         draw.totalPot = getCurrentPot();
        
//         emit TicketsBought(receiver, numTickets);
        
//         return true;
//     }
    
//     function processTransaction(uint256 bnbValue, uint16 numTickets, address recipient, address airdropRecipient) isState(LotteryState.Open) private returns(bool){
//         uint256 initialTokenBal = delo.balanceOf(address(this));
        
//         //take the marketing amount in bnb
//         if (takeMarketing == true){
//             bnbValue = bnbValue.sub(bnbValue.div(marketingDivisor));
//         }
        
//         //swap the bnb from the ticket sale for DELO
//         swapEthForDelo(bnbValue);
//         uint256 tokenAmount = delo.balanceOf(address(this)).sub(initialTokenBal);
        
//         if (takeHedge == true){
//             //give % of purchase back to purchaser, or to ticket recipient, or to charity recipient (if that address is authorised)
//             if (airdropRecipient == msg.sender || airdropRecipient == recipient || charityRecipients[airdropRecipient] == true){
//                 totalAirdropsReceived[airdropRecipient] += tokenAmount.div(hedgeDivisor);
//                 delo.transfer(airdropRecipient, tokenAmount.div(hedgeDivisor));
//             }
//             //record the amount of ticket airdrops the purchaser donated to charity
//             if (charityRecipients[airdropRecipient] == true){
//                 walletTotalCharityTickets[msg.sender] += numTickets;
//             }
//         }
        
//         if (takeStaking == true){
//             //call the ADDFUNDS method of staking contract to reward stakers
//             uint256 amt = tokenAmount.div(stakingDivisor);
//             delo.approve(deloStakingAddress, amt);
//             deloStaking.ADDFUNDS(amt);
//         }
        
//         return assignTickets(bnbValue, numTickets, recipient);
//     }
    
//     //to receive ETH from uniswapV2Router when swapping
//     receive() external payable {}
    
//     function swapTokensForEth(address _token, uint256 tokenAmount) private {
//         // generate the uniswap pair path of token -> weth
//         address[] memory path = new address[](2);
//         path[0] = _token;
//         path[1] = uniswapV2Router.WETH();

//         IERC20 token = IERC20(_token);
//         token.approve(address(uniswapV2Router), tokenAmount);

//         // make the swap
//         uniswapV2Router.swapExactTokensForETH(
//             tokenAmount,
//             0, // accept any amount of ETH
//             path,
//             address(this),
//             block.timestamp
//         );
//     }
    
//     function swapTokensWithFeeForEth(address _token, uint256 tokenAmount) private {
//         // generate the uniswap pair path of token -> weth
//         address[] memory path = new address[](2);
//         path[0] = _token;
//         path[1] = uniswapV2Router.WETH();

//         IERC20 token = IERC20(_token);
//         token.approve(address(uniswapV2Router), tokenAmount);

//         // make the swap
//         uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
//             tokenAmount,
//             0, // accept any amount of ETH
//             path,
//             address(this),
//             block.timestamp
//         );
//     }
    
//     function swapEthForDelo(uint256 ethAmount) private {
//         // generate the uniswap pair path of weth -> token
//         address[] memory path = new address[](2);
//         path[0] = uniswapV2Router.WETH();
//         path[1] = deloAddress;

//         // make the swap
//         uniswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
//             0, // accept any amount of token
//             path,
//             address(this),
//             block.timestamp
//         );
//     }
    
//     function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
//         // split the contract balance into halves
//         uint256 half = contractTokenBalance.div(2);
//         uint256 otherHalf = contractTokenBalance.sub(half);

//         // capture the contract's current ETH balance.
//         // this is so that we can capture exactly the amount of ETH that the
//         // swap creates, and not make the liquidity event include any ETH that
//         // has been manually sent to the contract
//         uint256 initialBalance = address(this).balance;

//         // swap tokens for ETH
//         swapTokensWithFeeForEth(deloAddress, half); // <- this breaks the ETH -> HATE swap when swap+liquify is triggered

//         // how much ETH did we just swap into?
//         uint256 newBalance = address(this).balance.sub(initialBalance);

//         // add liquidity to uniswap
//         addLiquidity(otherHalf, newBalance);
        
//         emit SwapAndLiquify(half, newBalance, otherHalf);
//     }
    
//     function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
//         // approve token transfer to cover all possible scenarios
//         delo.approve(address(uniswapV2Router), tokenAmount);

//         // add the liquidity
//         uniswapV2Router.addLiquidityETH{value: ethAmount}(
//             deloAddress,
//             tokenAmount,
//             0, // slippage is unavoidable
//             0, // slippage is unavoidable
//             address(this), // add liquidity to the contract
//             block.timestamp
//         );
//     }
    
// }
