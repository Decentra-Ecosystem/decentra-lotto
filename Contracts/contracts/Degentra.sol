// pragma solidity ^0.6.12;

// // SPDX-License-Identifier: Unlicensed

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/math/SafeMath.sol";
// import "@openzeppelin/contracts/utils/Context.sol";
// import "@openzeppelin/contracts/utils/Address.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
// import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol';
// import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';


// contract Degentra is Context, IERC20, Ownable {
//     using SafeMath for uint256;
//     using Address for address;

//     //address payable public developmentAddress = payable(0xdcf5C8273b57D0d227724DD2aC9A0ce010412d0f); // Development Address Mainnet
//     address payable public developmentAddress = payable(0x15E3B0a44e5d80Df5a97da0CdFd51598475cd181); // Development Address Testnet

//     mapping (address => uint256) private _rOwned;
//     mapping (address => uint256) private _tOwned;
//     mapping (address => mapping (address => uint256)) private _allowances;

//     mapping (address => bool) private _isExcludedFromFee;

//     mapping (address => bool) private _isExcluded;
//     address[] private _excluded;
   
//     uint256 private constant MAX = ~uint256(0);
//     uint256 private _tTotal = 10000000 * 10**9;
//     uint256 private _rTotal = (MAX - (MAX % _tTotal));
//     uint256 private _tFeeTotal;
//     uint256 public  _tBurnTotal;

//     string private constant _name = "Test";
//     string private constant _symbol = "SSS";
//     uint8 private constant _decimals = 9;
    
//     uint256 public _taxFee = 3;
//     uint256 private _previousTaxFee = _taxFee;
    
//     uint256 public _burnFee = 1;
//     uint256 private _previousBurnFee = _burnFee;
    
//     uint256 public _liquidityFee = 3;
//     uint256 private _previousLiquidityFee = _liquidityFee;
    
//     uint256 public _lottoFee = 3;
//     uint256 public _previousLottoFee = _lottoFee;
    
//     uint256 public totalToLotto = 0;
//     address public LOTTO_ADDRESS;
    
//     uint256 public minimumTokensBeforeSwap = 1000 * 10**9; 

//     IUniswapV2Router02 public uniswapV2Router;
//     address public uniswapV2Pair;
    
//     bool inSwapAndLiquify;
//     bool public swapAndLiquifyEnabled = true;
//     bool private tradingOpen;
    
//     uint256 public _maxTxAmount = 100000 * 10**9; //1%
//     uint256 public _maxWalletSize = 200000 * 10**9; //2%
    
//     // Using struct for tValues to avoid Stack too deep error
//     struct TValuesStruct {
//         uint256 tFee;
//         uint256 tMarketing;
//         uint256 tLotto;
//         uint256 tBurn;
//         uint256 tTransferAmount;
//     }
    
//     event MinTokensBeforeSwapUpdated(uint256 minTokensBeforeSwap);
//     event SwapAndLiquifyEnabledUpdated(bool enabled);
//     event SwapAndLiquify(
//         uint256 tokensSwapped,
//         uint256 ethReceived,
//         uint256 tokensIntoLiquidity
//     );
//     event SwapTokensForETH(
//         uint256 amountIn,
//         address[] path
//     );
    
//     modifier lockTheSwap {
//         inSwapAndLiquify = true;
//         _;
//         inSwapAndLiquify = false;
//     }
    
//     constructor () public {
//         _rOwned[_msgSender()] = _rTotal;
        
//         //pancake live router V2
//         //IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0x10ED43C718714eb63d5aA57B78B54704E256024E);
//         //pancake test router V2
//         IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3);
        
//          // Create a uniswap pair for this new token
//         uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
//             .createPair(address(this), _uniswapV2Router.WETH());

//         // set the rest of the contract variables
//         uniswapV2Router = _uniswapV2Router;
        
//         //exclude owner and this contract from fee
//         _isExcludedFromFee[owner()] = true;
//         _isExcludedFromFee[address(this)] = true;
        
//         LOTTO_ADDRESS = msg.sender;
        
//         emit Transfer(address(0), _msgSender(), _tTotal);
//     }
    
//     function name() external pure returns (string memory) {
//         return _name;
//     }

//     function symbol() external pure returns (string memory) {
//         return _symbol;
//     }

//     function decimals() external pure returns (uint8) {
//         return _decimals;
//     }

//     function totalSupply() external view override returns (uint256) {
//         return _tTotal;
//     }

//     function balanceOf(address account) public view override returns (uint256) {
//         if (_isExcluded[account]) return _tOwned[account];
//         return tokenFromReflection(_rOwned[account]);
//     }

//     function transfer(address recipient, uint256 amount) external override returns (bool) {
//         _transfer(_msgSender(), recipient, amount);
//         return true;
//     }

//     function allowance(address owner, address spender) external view override returns (uint256) {
//         return _allowances[owner][spender];
//     }

//     function approve(address spender, uint256 amount) external override returns (bool) {
//         _approve(_msgSender(), spender, amount);
//         return true;
//     }

//     function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
//         _transfer(sender, recipient, amount);
//         _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
//         return true;
//     }

//     function increaseAllowance(address spender, uint256 addedValue) external virtual returns (bool) {
//         _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
//         return true;
//     }

//     function decreaseAllowance(address spender, uint256 subtractedValue) external virtual returns (bool) {
//         _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
//         return true;
//     }

//     function isExcludedFromReward(address account) external view returns (bool) {
//         return _isExcluded[account];
//     }

//     function totalFees() external view returns (uint256) {
//         return _tFeeTotal;
//     }

//     function reflectionFromToken(uint256 tAmount, bool deductTransferFee) external view returns(uint256) {
//         require(tAmount <= _tTotal, "Amount must be less than supply");
//         if (!deductTransferFee) {
//             (uint256 rAmount,,,) = _getValues(tAmount);
//             return rAmount;
//         } else {
//             (,uint256 rTransferAmount,,) = _getValues(tAmount);
//             return rTransferAmount;
//         }
//     }

//     function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
//         require(rAmount <= _rTotal, "Amount must be less than total reflections");
//         uint256 currentRate =  _getRate();
//         return rAmount.div(currentRate);
//     }
    
//     function setRouterAddress(address newRouter) external onlyOwner() {
//         IUniswapV2Router02 _newPancakeRouter = IUniswapV2Router02(newRouter);
//         uniswapV2Pair = IUniswapV2Factory(_newPancakeRouter.factory()).createPair(address(this), _newPancakeRouter.WETH());
//         uniswapV2Router = _newPancakeRouter;
//     }
    
//     function withdrawEth(uint amount) external onlyOwner {
//         msg.sender.transfer(amount);
//     }

//     function setTrading(bool _tradingOpen) public onlyOwner {
//         tradingOpen = _tradingOpen;
//     }

//     function buybackBurn(uint256 amount) external onlyOwner {
//         swapEthForTokens(amount);
//     }

//     function setLottoWallet(address _lottoWallet) external onlyOwner {
//         LOTTO_ADDRESS= _lottoWallet;
//     }

//     function excludeFromReward(address account) external onlyOwner() {
//         // require(account != 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D, 'We can not exclude Uniswap router.');
//         require(!_isExcluded[account], "Account is already excluded");
//         if(_rOwned[account] > 0) {
//             _tOwned[account] = tokenFromReflection(_rOwned[account]);
//         }
//         _isExcluded[account] = true;
//         _excluded.push(account);
//     }

//     function includeInReward(address account) external onlyOwner() {
//         require(_isExcluded[account], "Account is not excluded");
//         for (uint256 i = 0; i < _excluded.length; i++) {
//             if (_excluded[i] == account) {
//                 _excluded[i] = _excluded[_excluded.length - 1];
//                 _tOwned[account] = 0;
//                 _isExcluded[account] = false;
//                 _excluded.pop();
//                 break;
//             }
//         }
//     }
    
//     function _transferBothExcluded(address sender, address recipient, uint256 tAmount) private {
//         uint256 currentRate =  _getRate();
//         (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, TValuesStruct memory tValues) = _getValues(tAmount);
//         uint256 rBurn =  tValues.tBurn.mul(currentRate);
//         _tOwned[sender] = _tOwned[sender].sub(tAmount);
//         _rOwned[sender] = _rOwned[sender].sub(rAmount);
//         _tOwned[recipient] = _tOwned[recipient].add(tValues.tTransferAmount);
//         _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);        
//         _takeMarketing(tValues.tMarketing);
//         _takeLotto(tValues.tLotto);
//         _reflectFee(rFee, rBurn, tValues.tFee, tValues.tBurn);
//         emit Transfer(sender, recipient, tValues.tTransferAmount);
//     }
    
//     function excludeFromFee(address account) external onlyOwner {
//         _isExcludedFromFee[account] = true;
//     }
    
//     function includeInFee(address account) external onlyOwner {
//         _isExcludedFromFee[account] = false;
//     }
    
//     function setTaxFeePercent(uint256 taxFee) external onlyOwner() {
//         _taxFee = taxFee;
//     }

//     function setBurnFeePercent(uint256 burnFee) external onlyOwner() {
//         _burnFee = burnFee;
//     }
    
//     function setLottoFeePercent(uint256 lottoFee) external onlyOwner() {
//         _lottoFee = lottoFee;
//     }
    
//     function setLiquidityFeePercent(uint256 liquidityFee) external onlyOwner() {
//         require(liquidityFee < 5, "Liquidity fee can never be more than 5%");
//         _liquidityFee = liquidityFee;
//     }
    
//     function setDevelopmentAddress(address _developmentAddress) external onlyOwner() {
//         developmentAddress = payable(_developmentAddress);
//     }
   
//     function setMaxTxPercent(uint256 maxTxPercent) external onlyOwner() {
//         _maxTxAmount = _tTotal.mul(maxTxPercent).div(
//             10**2
//         );
//     }
    
//     function setNumTokensSellToAddToMarketing(uint256 _minimumTokensBeforeSwap) external onlyOwner() {
//         minimumTokensBeforeSwap = _minimumTokensBeforeSwap;
//     }

//     function setSwapAndLiquifyEnabled(bool _enabled) external onlyOwner {
//         swapAndLiquifyEnabled = _enabled;
//         emit SwapAndLiquifyEnabledUpdated(_enabled);
//     }
    
//      //to receive ETH from uniswapV2Router when swapping
//     receive() external payable {}

//     function _reflectFee(uint256 rFee, uint256 rBurn, uint256 tFee, uint256 tBurn) private {
//         _rTotal = _rTotal.sub(rFee).sub(rBurn);
//         _tFeeTotal = _tFeeTotal.add(tFee);
//         _tBurnTotal = _tBurnTotal.add(tBurn);
//         _tTotal = _tTotal.sub(tBurn);
//     }

//     function _getValues(uint256 tAmount) private view returns (uint256, uint256, uint256, TValuesStruct memory) {
//         TValuesStruct memory tValues = _getTValues(tAmount);
//         (uint256 rAmount, uint256 rTransferAmount, uint256 rFee) = _getRValues(tAmount, tValues, _getRate());
//         return (rAmount, rTransferAmount, rFee, tValues);
//     }

//     function _getTValues(uint256 tAmount) private view returns (TValuesStruct memory) {
//          // Using struct to avoid Stack too deep error
//          TValuesStruct memory tValues = TValuesStruct(
//              {
//                  tFee:calculateTaxFee(tAmount),
//                  tMarketing: calculateMarketingFee(tAmount),
//                  tLotto: calculateLottoFee(tAmount),
//                  tBurn: calculateBurnFee(tAmount),
//                  tTransferAmount: tAmount
//              }   
//         );
//         tValues.tTransferAmount = tValues.tTransferAmount.sub(tValues.tFee).sub(tValues.tMarketing);
//         tValues.tTransferAmount = tValues.tTransferAmount.sub(tValues.tLotto).sub(tValues.tBurn);
        
//         return tValues;
//     }

//     function _getRValues(uint256 tAmount, TValuesStruct memory tValues, uint256 currentRate) private pure returns (uint256, uint256, uint256) {
//         uint256 rAmount = tAmount.mul(currentRate);
//         uint256 rFee = tValues.tFee.mul(currentRate);
//         uint256 rMarketing = tValues.tMarketing.mul(currentRate);
//         uint256 rLotto = tValues.tLotto.mul(currentRate);
//         uint256 rBurn = tValues.tBurn.mul(currentRate);
//         uint256 rTransferAmount = rAmount.sub(rFee).sub(rMarketing).sub(rLotto).sub(rBurn);
//         return (rAmount, rTransferAmount, rFee);
//     }

//     function _getRate() private view returns(uint256) {
//         (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
//         return rSupply.div(tSupply);
//     }

//     function _getCurrentSupply() private view returns(uint256, uint256) {
//         uint256 rSupply = _rTotal;
//         uint256 tSupply = _tTotal;      
//         for (uint256 i = 0; i < _excluded.length; i++) {
//             if (_rOwned[_excluded[i]] > rSupply || _tOwned[_excluded[i]] > tSupply) return (_rTotal, _tTotal);
//             rSupply = rSupply.sub(_rOwned[_excluded[i]]);
//             tSupply = tSupply.sub(_tOwned[_excluded[i]]);
//         }
//         if (rSupply < _rTotal.div(_tTotal)) return (_rTotal, _tTotal);
//         return (rSupply, tSupply);
//     }
    
//     function _takeMarketing(uint256 tMarketing) private {
//         uint256 currentRate =  _getRate();
//         uint256 rMarketing = tMarketing.mul(currentRate);
//         _rOwned[address(this)] = _rOwned[address(this)].add(rMarketing);
//         if(_isExcluded[address(this)])
//             _tOwned[address(this)] = _tOwned[address(this)].add(tMarketing);
//     }
    
//     function _takeLotto(uint256 tLotto) private {
//         uint256 currentRate =  _getRate();
//         uint256 rLotto = tLotto.mul(currentRate);
//         _rOwned[LOTTO_ADDRESS] = _rOwned[LOTTO_ADDRESS].add(rLotto);
//         totalToLotto = totalToLotto.add(rLotto);
//         if(_isExcluded[LOTTO_ADDRESS])
//             _tOwned[LOTTO_ADDRESS] = _tOwned[LOTTO_ADDRESS].add(tLotto);
//     }
    
//     function calculateTaxFee(uint256 _amount) private view returns (uint256) {
//         return _amount.mul(_taxFee).div(
//             10**2
//         );
//     }
    
//     function calculateLottoFee(uint256 _amount) private view returns (uint256) {
//         return _amount.mul(_lottoFee).div(
//             10**2
//         );
//     }
    
//     function calculateBurnFee(uint256 _amount) private view returns (uint256) {
//         return _amount.mul(_burnFee).div(
//             10**2
//         );
//     }

//     function calculateMarketingFee(uint256 _amount) private view returns (uint256) {
//         return _amount.mul(_liquidityFee).div(
//             10**2
//         );
//     }
    
//     function removeAllFee() private {
//         if(_taxFee == 0 && _liquidityFee == 0 && _lottoFee == 0 && _burnFee == 0) return;
        
//         _previousTaxFee = _taxFee;
//         _previousLiquidityFee = _liquidityFee;
//         _previousLottoFee = _lottoFee;
//         _previousBurnFee = _burnFee;
        
//         _taxFee = 0;
//         _liquidityFee = 0;
//         _lottoFee = 0;
//         _burnFee = 0;
//     }
    
//     function restoreAllFee() private {
//         _taxFee = _previousTaxFee;
//         _liquidityFee = _previousLiquidityFee;
//         _lottoFee = _previousLottoFee;
//         _burnFee = _previousBurnFee;
//     }
    
//     function isExcludedFromFee(address account) external view returns(bool) {
//         return _isExcludedFromFee[account];
//     }

//     function _approve(address owner, address spender, uint256 amount) private {
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
//         if(from != owner() && to != owner()){
//             require(tradingOpen == true, "TOKEN: This account cannot send tokens until trading is enabled");
//             require(amount <= _maxTxAmount, "Transfer amount exceeds the maxTxAmount.");
//             if(to != uniswapV2Pair) {
//                 require(balanceOf(to) + amount < _maxWalletSize, "TOKEN: Balance exceeds wallet size!");
//             }
//             uint256 contractTokenBalance = balanceOf(address(this));
//             bool overMinimumTokenBalance = contractTokenBalance >= minimumTokensBeforeSwap;
            
//             if (overMinimumTokenBalance && !inSwapAndLiquify && swapAndLiquifyEnabled && from != uniswapV2Pair && !_isExcludedFromFee[from] && !_isExcludedFromFee[to]) {
//                 contractTokenBalance = minimumTokensBeforeSwap;
//                 swapTokens(contractTokenBalance); 
//             }
//         }

//         //indicates if fee should be deducted from transfer
//         bool takeFee = true;
        
//         //if any account belongs to _isExcludedFromFee account then remove the fee
//         if(_isExcludedFromFee[from] || _isExcludedFromFee[to]){
//             takeFee = false;
//         }
        
//         //transfer amount, it will take tax, burn, marketing fee
//         _tokenTransfer(from,to,amount,takeFee);
//     }
    
//     function swapTokens(uint256 contractTokenBalance) private lockTheSwap {
       
//         uint256 initialBalance = address(this).balance;
//         swapTokensForEth(contractTokenBalance);
//         uint256 transferredBalance = address(this).balance.sub(initialBalance);

//         //Send to Marketing address
//         transferToAddressETH(developmentAddress, transferredBalance);
//     }

//     function swapTokensForEth(uint256 tokenAmount) private {
//         // generate the uniswap pair path of token -> weth
//         address[] memory path = new address[](2);
//         path[0] = address(this);
//         path[1] = uniswapV2Router.WETH();

//         _approve(address(this), address(uniswapV2Router), tokenAmount);

//         // make the swap
//         uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
//             tokenAmount,
//             0, // accept any amount of ETH
//             path,
//             address(this), // The contract
//             block.timestamp
//         );
        
//         emit SwapTokensForETH(tokenAmount, path);
//     }

//     function swapEthForTokens(uint256 ethAmount) private {
//         // generate the uniswap pair path of weth -> token
//         address[] memory path = new address[](2);
//         path[0] = uniswapV2Router.WETH();
//         path[1] = address(this);

//         // make the swap
//         uniswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
//             0, // accept any amount of token
//             path,
//             0x000000000000000000000000000000000000dEaD,
//             block.timestamp
//         );
//     }

//     //this method is responsible for taking all fee, if takeFee is true
//     function _tokenTransfer(address sender, address recipient, uint256 amount,bool takeFee) private {
//         if(!takeFee)
//             removeAllFee();
        
//         if (_isExcluded[sender] && !_isExcluded[recipient]) {
//             _transferFromExcluded(sender, recipient, amount);
//         } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
//             _transferToExcluded(sender, recipient, amount);
//         } else if (_isExcluded[sender] && _isExcluded[recipient]) {
//             _transferBothExcluded(sender, recipient, amount);
//         } else {
//             _transferStandard(sender, recipient, amount);
//         }
        
//         if(!takeFee)
//             restoreAllFee();
//     }

//     function _transferStandard(address sender, address recipient, uint256 tAmount) private {
//         uint256 currentRate =  _getRate();
//         (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, TValuesStruct memory tValues) = _getValues(tAmount);
//         uint256 rBurn =  tValues.tBurn.mul(currentRate);
//         _rOwned[sender] = _rOwned[sender].sub(rAmount);
//         _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
//         _takeMarketing(tValues.tMarketing);
//         _reflectFee(rFee, rBurn, tValues.tFee, tValues.tBurn);
//         _takeLotto(tValues.tLotto);
//         emit Transfer(sender, recipient, tValues.tTransferAmount);
//     }

//     function _transferToExcluded(address sender, address recipient, uint256 tAmount) private {
//         uint256 currentRate =  _getRate();
//         (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, TValuesStruct memory tValues) = _getValues(tAmount);
//         uint256 rBurn =  tValues.tBurn.mul(currentRate);
//         _rOwned[sender] = _rOwned[sender].sub(rAmount);
//         _tOwned[recipient] = _tOwned[recipient].add(tValues.tTransferAmount);
//         _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);           
//         _takeMarketing(tValues.tMarketing);
//         _takeLotto(tValues.tLotto);
//         _reflectFee(rFee, rBurn, tValues.tFee, tValues.tBurn);
//         emit Transfer(sender, recipient, tValues.tTransferAmount);
//     }

//     function _transferFromExcluded(address sender, address recipient, uint256 tAmount) private {
//         uint256 currentRate =  _getRate();
//         (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, TValuesStruct memory tValues) = _getValues(tAmount);
//         uint256 rBurn =  tValues.tBurn.mul(currentRate);
//         _tOwned[sender] = _tOwned[sender].sub(tAmount);
//         _rOwned[sender] = _rOwned[sender].sub(rAmount);
//         _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);   
//         _takeMarketing(tValues.tMarketing);
//         _takeLotto(tValues.tLotto);
//         _reflectFee(rFee, rBurn, tValues.tFee, tValues.tBurn);
//         emit Transfer(sender, recipient, tValues.tTransferAmount);
//     }

//     function transferToAddressETH(address payable recipient, uint256 amount) private {
//         recipient.transfer(amount);
//     }
// }
