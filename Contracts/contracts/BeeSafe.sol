// // SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.6.12 <=0.8.4;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/math/SafeMath.sol";
// import "@openzeppelin/contracts/utils/Context.sol";
// import "@openzeppelin/contracts/utils/Address.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
// import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

// contract BeeSafe is Context, IERC20, Ownable {///////////////////////////////////////////////////////////

//     using SafeMath for uint256;

//     string private constant _name = "BeeSafe";//////////////////////////
//     string private constant _symbol = "BSAFE";//////////////////////////////////////////////////////////////////////////
//     uint8 private constant _decimals = 9;

//     mapping(address => uint256) private _rOwned;
//     mapping(address => uint256) private _tOwned;
//     mapping(address => mapping(address => uint256)) private _allowances;
//     mapping(address => bool) private _isExcludedFromFee;
//     uint256 private constant MAX = ~uint256(0);
//     uint256 private constant _tTotal = 10000000 * 10**9;
//     uint256 private _rTotal = (MAX - (MAX % _tTotal));
//     uint256 private _tFeeTotal;

//     //Buy Fee
//     uint256 private _redisFeeOnBuy = 1;////////////////////////////////////////////////////////////////////
//     uint256 private _taxFeeOnBuy = 12;//////////////////////////////////////////////////////////////////////

//     //Sell Fee
//     uint256 private _redisFeeOnSell = 1;/////////////////////////////////////////////////////////////////////
//     uint256 private _taxFeeOnSell = 16;/////////////////////////////////////////////////////////////////////

//     //Original Fee
//     uint256 private _redisFee = _redisFeeOnSell;
//     uint256 private _taxFee = _taxFeeOnSell;

//     uint256 private _previousredisFee = _redisFee;
//     uint256 private _previoustaxFee = _taxFee;

//     mapping(address => bool) public bots;
//     mapping(address => uint256) private cooldown;

//     address payable private _developmentAddress = payable(0xBF37803D1EC59F4F510be25BaE7B2a51CA6d4108);/////////////////////////////////////////////////
//     address payable private _marketingAddress = payable(0xE8d9B4A2e1C5a3c5BA70bEdaCe6Af16Cf27AEc6a);///////////////////////////////////////////////////

//     IUniswapV2Router02 public uniswapV2Router;
//     address public uniswapV2Pair;

//     bool private tradingOpen;
//     bool private inSwap = false;
//     bool private swapEnabled = true;

//     uint256 public _maxTxAmount = 100000 * 10**9; //1%
//     uint256 public _maxWalletSize = 200000 * 10**9; //2%
//     uint256 public _swapTokensAtAmount = 10000 * 10**9; //0.1%

//     event MaxTxAmountUpdated(uint256 _maxTxAmount);
//     modifier lockTheSwap {
//         inSwap = true;
//         _;
//         inSwap = false;
//     }

//     constructor() {

//         _rOwned[_msgSender()] = _rTotal;

//         IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);/////////////////////////////////////////////////
//         uniswapV2Router = _uniswapV2Router;
//         uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
//             .createPair(address(this), _uniswapV2Router.WETH());

//         _isExcludedFromFee[owner()] = true;
//         _isExcludedFromFee[address(this)] = true;
//         _isExcludedFromFee[_developmentAddress] = true;
//         _isExcludedFromFee[_marketingAddress] = true;

//         bots[address(0x66f049111958809841Bbe4b81c034Da2D953AA0c)] = true;
//         bots[address(0x000000005736775Feb0C8568e7DEe77222a26880)] = true;
//         bots[address(0x34822A742BDE3beF13acabF14244869841f06A73)] = true;
//         bots[address(0x69611A66d0CF67e5Ddd1957e6499b5C5A3E44845)] = true;
//         bots[address(0x69611A66d0CF67e5Ddd1957e6499b5C5A3E44845)] = true;
//         bots[address(0x8484eFcBDa76955463aa12e1d504D7C6C89321F8)] = true;
//         bots[address(0xe5265ce4D0a3B191431e1bac056d72b2b9F0Fe44)] = true;
//         bots[address(0x33F9Da98C57674B5FC5AE7349E3C732Cf2E6Ce5C)] = true;
//         bots[address(0xc59a8E2d2c476BA9122aa4eC19B4c5E2BBAbbC28)] = true;
//         bots[address(0x21053Ff2D9Fc37D4DB8687d48bD0b57581c1333D)] = true;
//         bots[address(0x4dd6A0D3191A41522B84BC6b65d17f6f5e6a4192)] = true;


//         emit Transfer(address(0), _msgSender(), _tTotal);
//     }

//     function name() public pure returns (string memory) {
//         return _name;
//     }

//     function symbol() public pure returns (string memory) {
//         return _symbol;
//     }

//     function decimals() public pure returns (uint8) {
//         return _decimals;
//     }

//     function totalSupply() public pure override returns (uint256) {
//         return _tTotal;
//     }

//     function balanceOf(address account) public view override returns (uint256) {
//         return tokenFromReflection(_rOwned[account]);
//     }

//     function transfer(address recipient, uint256 amount)
//         public
//         override
//         returns (bool)
//     {
//         _transfer(_msgSender(), recipient, amount);
//         return true;
//     }

//     function allowance(address owner, address spender)
//         public
//         view
//         override
//         returns (uint256)
//     {
//         return _allowances[owner][spender];
//     }

//     function approve(address spender, uint256 amount)
//         public
//         override
//         returns (bool)
//     {
//         _approve(_msgSender(), spender, amount);
//         return true;
//     }

//     function transferFrom(
//         address sender,
//         address recipient,
//         uint256 amount
//     ) public override returns (bool) {
//         _transfer(sender, recipient, amount);
//         _approve(
//             sender,
//             _msgSender(),
//             _allowances[sender][_msgSender()].sub(
//                 amount,
//                 "ERC20: transfer amount exceeds allowance"
//             )
//         );
//         return true;
//     }

//     function tokenFromReflection(uint256 rAmount)
//         private
//         view
//         returns (uint256)
//     {
//         require(
//             rAmount <= _rTotal,
//             "Amount must be less than total reflections"
//         );
//         uint256 currentRate = _getRate();
//         return rAmount.div(currentRate);
//     }

//     function removeAllFee() private {
//         if (_redisFee == 0 && _taxFee == 0) return;

//         _previousredisFee = _redisFee;
//         _previoustaxFee = _taxFee;

//         _redisFee = 0;
//         _taxFee = 0;
//     }

//     function restoreAllFee() private {
//         _redisFee = _previousredisFee;
//         _taxFee = _previoustaxFee;
//     }

//     function _approve(
//         address owner,
//         address spender,
//         uint256 amount
//     ) private {
//         require(owner != address(0), "ERC20: approve from the zero address");
//         require(spender != address(0), "ERC20: approve to the zero address");
//         _allowances[owner][spender] = amount;
//         emit Approval(owner, spender, amount);
//     }

//     function _transfer(
//         address from,
//         address to,
//         uint256 amount
//     ) private {
//         require(from != address(0), "ERC20: transfer from the zero address");
//         require(to != address(0), "ERC20: transfer to the zero address");
//         require(amount > 0, "Transfer amount must be greater than zero");

//         if (from != owner() && to != owner()) {

//             //Trade start check
//             if (!tradingOpen) {
//                 require(from == owner(), "TOKEN: This account cannot send tokens until trading is enabled");
//             }

//             require(amount <= _maxTxAmount, "TOKEN: Max Transaction Limit");
//             require(!bots[from] && !bots[to], "TOKEN: Your account is blacklisted!");

//             if(to != uniswapV2Pair) {
//                 require(balanceOf(to) + amount < _maxWalletSize, "TOKEN: Balance exceeds wallet size!");
//             }

//             uint256 contractTokenBalance = balanceOf(address(this));
//             bool canSwap = contractTokenBalance >= _swapTokensAtAmount;

//             if(contractTokenBalance >= _maxTxAmount)
//             {
//                 contractTokenBalance = _maxTxAmount;
//             }

//             if (canSwap && !inSwap && from != uniswapV2Pair && swapEnabled && !_isExcludedFromFee[from] && !_isExcludedFromFee[to]) {
//                 swapTokensForEth(contractTokenBalance);
//                 uint256 contractETHBalance = address(this).balance;
//                 if (contractETHBalance > 0) {
//                     sendETHToFee(address(this).balance);
//                 }
//             }
//         }

//         bool takeFee = true;

//         //Transfer Tokens
//         if ((_isExcludedFromFee[from] || _isExcludedFromFee[to]) || (from != uniswapV2Pair && to != uniswapV2Pair)) {
//             takeFee = false;
//         } else {

//             //Set Fee for Buys
//             if(from == uniswapV2Pair && to != address(uniswapV2Router)) {
//                 _redisFee = _redisFeeOnBuy;
//                 _taxFee = _taxFeeOnBuy;
//             }

//             //Set Fee for Sells
//             if (to == uniswapV2Pair && from != address(uniswapV2Router)) {
//                 _redisFee = _redisFeeOnSell;
//                 _taxFee = _taxFeeOnSell;
//             }

//         }

//         _tokenTransfer(from, to, amount, takeFee);
//     }

//     function swapTokensForEth(uint256 tokenAmount) private lockTheSwap {
//         address[] memory path = new address[](2);
//         path[0] = address(this);
//         path[1] = uniswapV2Router.WETH();
//         _approve(address(this), address(uniswapV2Router), tokenAmount);
//         uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
//             tokenAmount,
//             0,
//             path,
//             address(this),
//             block.timestamp
//         );
//     }

//     function sendETHToFee(uint256 amount) private {
//         _developmentAddress.transfer(amount.div(2));
//         _marketingAddress.transfer(amount.div(2));
//     }

//     function setTrading(bool _tradingOpen) public onlyOwner {
//         tradingOpen = _tradingOpen;
//     }

//     function manualswap() external {
//         require(_msgSender() == _developmentAddress || _msgSender() == _marketingAddress);
//         uint256 contractBalance = balanceOf(address(this));
//         swapTokensForEth(contractBalance);
//     }

//     function manualsend() external {
//         require(_msgSender() == _developmentAddress || _msgSender() == _marketingAddress);
//         uint256 contractETHBalance = address(this).balance;
//         sendETHToFee(contractETHBalance);
//     }

//     function blockBots(address[] memory bots_) public onlyOwner {
//         for (uint256 i = 0; i < bots_.length; i++) {
//             bots[bots_[i]] = true;
//         }
//     }

//     function unblockBot(address notbot) public onlyOwner {
//         bots[notbot] = false;
//     }

//     function _tokenTransfer(
//         address sender,
//         address recipient,
//         uint256 amount,
//         bool takeFee
//     ) private {
//         if (!takeFee) removeAllFee();
//         _transferStandard(sender, recipient, amount);
//         if (!takeFee) restoreAllFee();
//     }

//     function _transferStandard(
//         address sender,
//         address recipient,
//         uint256 tAmount
//     ) private {
//         (
//             uint256 rAmount,
//             uint256 rTransferAmount,
//             uint256 rFee,
//             uint256 tTransferAmount,
//             uint256 tFee,
//             uint256 tTeam
//         ) = _getValues(tAmount);
//         _rOwned[sender] = _rOwned[sender].sub(rAmount);
//         _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
//         _takeTeam(tTeam);
//         _reflectFee(rFee, tFee);
//         emit Transfer(sender, recipient, tTransferAmount);
//     }

//     function _takeTeam(uint256 tTeam) private {
//         uint256 currentRate = _getRate();
//         uint256 rTeam = tTeam.mul(currentRate);
//         _rOwned[address(this)] = _rOwned[address(this)].add(rTeam);
//     }

//     function _reflectFee(uint256 rFee, uint256 tFee) private {
//         _rTotal = _rTotal.sub(rFee);
//         _tFeeTotal = _tFeeTotal.add(tFee);
//     }

//     receive() external payable {}

//     function _getValues(uint256 tAmount)
//         private
//         view
//         returns (
//             uint256,
//             uint256,
//             uint256,
//             uint256,
//             uint256,
//             uint256
//         )
//     {
//         (uint256 tTransferAmount, uint256 tFee, uint256 tTeam) =
//             _getTValues(tAmount, _redisFee, _taxFee);
//         uint256 currentRate = _getRate();
//         (uint256 rAmount, uint256 rTransferAmount, uint256 rFee) =
//             _getRValues(tAmount, tFee, tTeam, currentRate);

//         return (rAmount, rTransferAmount, rFee, tTransferAmount, tFee, tTeam);
//     }

//     function _getTValues(
//         uint256 tAmount,
//         uint256 redisFee,
//         uint256 taxFee
//     )
//         private
//         pure
//         returns (
//             uint256,
//             uint256,
//             uint256
//         )
//     {
//         uint256 tFee = tAmount.mul(redisFee).div(100);
//         uint256 tTeam = tAmount.mul(taxFee).div(100);
//         uint256 tTransferAmount = tAmount.sub(tFee).sub(tTeam);

//         return (tTransferAmount, tFee, tTeam);
//     }

//     function _getRValues(
//         uint256 tAmount,
//         uint256 tFee,
//         uint256 tTeam,
//         uint256 currentRate
//     )
//         private
//         pure
//         returns (
//             uint256,
//             uint256,
//             uint256
//         )
//     {
//         uint256 rAmount = tAmount.mul(currentRate);
//         uint256 rFee = tFee.mul(currentRate);
//         uint256 rTeam = tTeam.mul(currentRate);
//         uint256 rTransferAmount = rAmount.sub(rFee).sub(rTeam);

//         return (rAmount, rTransferAmount, rFee);
//     }

//     function _getRate() private view returns (uint256) {
//         (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();

//         return rSupply.div(tSupply);
//     }

//     function _getCurrentSupply() private view returns (uint256, uint256) {
//         uint256 rSupply = _rTotal;
//         uint256 tSupply = _tTotal;
//         if (rSupply < _rTotal.div(_tTotal)) return (_rTotal, _tTotal);

//         return (rSupply, tSupply);
//     }

//     function setFee(uint256 redisFeeOnBuy, uint256 redisFeeOnSell, uint256 taxFeeOnBuy, uint256 taxFeeOnSell) public onlyOwner {
//         _redisFeeOnBuy = redisFeeOnBuy;
//         _redisFeeOnSell = redisFeeOnSell;

//         _taxFeeOnBuy = taxFeeOnBuy;
//         _taxFeeOnSell = taxFeeOnSell;
//     }

//     //Set minimum tokens required to swap.
//     function setMinSwapTokensThreshold(uint256 swapTokensAtAmount) public onlyOwner {
//         _swapTokensAtAmount = swapTokensAtAmount;
//     }

//     //Set minimum tokens required to swap.
//     function toggleSwap(bool _swapEnabled) public onlyOwner {
//         swapEnabled = _swapEnabled;
//     }


//     //Set MAx transaction
//     function setMaxTxnAmount(uint256 maxTxAmount) public onlyOwner {
//         _maxTxAmount = maxTxAmount;
//     }

//     function setMaxWalletSize(uint256 maxWalletSize) public onlyOwner {
//         _maxWalletSize = maxWalletSize;
//     }

//     function excludeMultipleAccountsFromFees(address[] calldata accounts, bool excluded) public onlyOwner {
//         for(uint256 i = 0; i < accounts.length; i++) {
//             _isExcludedFromFee[accounts[i]] = excluded;
//         }
//     }
// }