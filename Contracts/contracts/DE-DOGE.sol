// SPDX-License-Identifier: UNLICENSED

/**

   #Lucky Panda #LUCKYP

   TG: https://t.me/LuckyPandaPortal
   Website: https://luckypandatoken.net/

   2% fee auto add to the liquidity pool to locked forever when selling
   1% fee auto distribute to all holders
   5% fee auto moved to dev wallet
   4% lotto fee

 */
pragma solidity 0.8.7;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

abstract contract RandomNumberConsumer is VRFConsumerBase {
    
    bytes32 internal keyHash;
    uint256 internal fee;
    
    uint256 public randomResult;
    
    //contracts: https://docs.chain.link/docs/vrf-contracts/
    //faucets: https://docs.chain.link/docs/link-token-contracts/
    constructor(address _vrfCoordinator, address _link, bytes32 _keyHash, uint256 _fee) 
        VRFConsumerBase(
            _vrfCoordinator, // VRF Coordinator
            _link  // LINK Token
        )
    {
        keyHash = _keyHash;
        fee = _fee; // 0.1 LINK for testnet, 0.2 LINK for Live (Varies by network)
    }
    
    /** 
     * Requests randomness 
     */
    function getRandomNumber() internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }
}

contract DecentraTokens is Context, IERC20, Ownable, RandomNumberConsumer {
    using Address for address;

    address[] private _addressList;
    mapping (address => bool) private _AddressExists;
    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    mapping (address => mapping (address => uint256)) private _allowances;

    //
    address constant public DEAD = 0x000000000000000000000000000000000000dEaD;
    address constant public JACKPOT_TOKEN = 0x8B3192f5eEBD8579568A2Ed41E6FEB402f93f73F; //SAITAMA
    mapping (address => bool) private _isSniperOrBlacklisted;
    bool private sniperProtection = true;
    bool public _hasLiqBeenAdded = false;
    uint256 private _liqAddBlock = 0;
    uint256 public snipersCaught = 0;
    uint256 private snipeBlockAmt = 2;
    //

    mapping (address => bool) private _isExcludedFromFee;
    mapping (address => bool) private _isExcludedFromMaxTx;
    mapping (address => bool) private _isExcludedFromMaxWallet;
    mapping (address => bool) private _isExcluded;
    mapping (address => bool) private _isLottoExcluded;
    address[] private _excluded;

    uint256 private constant MAX = ~uint256(0);
    uint256 private _tTotal = 1 * 10**12 * 10**9;
    uint256 private _rTotal = (MAX - (MAX % _tTotal));
    uint256 private _tFeeTotal;

	address payable private _devWallet;
    address payable private _ecosystemWallet;
	uint256 private _minLottoBalance = 1 * 10**9 * 10**9;
	uint256 public maxLottoWin = 0;
	address public maxLottoAddress;
    LotteryState public state;

    string private _name = "Decentra SAITAMA";
    string private _symbol = "DSAI";
    uint8 private _decimals = 9;

    uint256 public _taxFee = 1;
    uint256 private _previousTaxFee = _taxFee;

    uint256 public _jackpotFee = 2;
    uint256 private _previousJackpotFee = _jackpotFee;

    uint256 public _percentOfSwapIsEcosystem = 22;
    uint256 public _percentOfSwapIsLotto = 22;
    uint256 public _ecosystemLottoDevFee = 7;
    uint256 private _previousEcosystemLottoDevFee = _ecosystemLottoDevFee;

    IUniswapV2Router02 public immutable uniswapV2Router;
    address public immutable uniswapV2Pair;

    bool inSwapAndLiquify;
    bool public swapAndLiquifyEnabled = false;

    uint256 public _maxTxAmount = 125 * 10**8 * 10**9;
    uint256 public _maxWalletAmount = 20 * 10**9 * 10**9;
    uint256 private numTokensSellToAddToLiquidity =  25 * 10**8 * 10**9;

    bytes32 private requestId;

    event MinTokensBeforeSwapUpdated(uint256 minTokensBeforeSwap);
    event SwapAndLiquifyEnabledUpdated(bool enabled);
    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );
    event SniperCaught(address sniperAddress);
    event LotteryStateChanged(LotteryState newState);

    enum LotteryState{
        Open,
        GettingRandom,
        GotRandom
    }

    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    constructor (address router, address marketingWallet, address ecosystemWallet) 
        RandomNumberConsumer(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, //vrfCoordinator rinkeby
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709, //link address rinkeby
            0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311, //key hash rinkeby
            0.1 * 10 ** 18 //fee rinkeby
        ) public {
        _rOwned[owner()] = _rTotal;

		addAddress(owner());
		_devWallet = payable(marketingWallet);
        _ecosystemWallet = payable(ecosystemWallet);

        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(router);
         // Create a uniswap pair for this new token
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());

        // set the rest of the contract variables
        uniswapV2Router = _uniswapV2Router;

        //exclude owner, ecosystem and this contract from fee
        _isExcludedFromFee[owner()] = true;
        _isExcludedFromFee[_devWallet] = true;
        _isExcludedFromFee[_ecosystemWallet] = true;
        _isExcludedFromFee[address(this)] = true;
        _isExcludedFromMaxTx[owner()] = true;
        _isExcludedFromMaxTx[_devWallet] = true;
        _isExcludedFromMaxTx[_ecosystemWallet] = true;
        _isExcludedFromMaxWallet[owner()] = true;
        _isExcludedFromMaxWallet[_devWallet] = true;
        _isExcludedFromMaxWallet[_ecosystemWallet] = true;
        _isExcludedFromMaxWallet[address(this)] = true;
        _isExcludedFromMaxWallet[DEAD] = true;
        _isLottoExcluded[owner()] = true;
        _isLottoExcluded[_devWallet] = true;
        _isLottoExcluded[_ecosystemWallet] = true;

        emit Transfer(address(0), owner(), _tTotal);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if (_isExcluded[account]) return _tOwned[account];
        return tokenFromReflection(_rOwned[account]);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()]-(amount));
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender]+(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender]-(subtractedValue));
        return true;
    }

    function isExcludedFromReward(address account) public view returns (bool) {
        return _isExcluded[account];
    }

    function totalFees() public view returns (uint256) {
        return _tFeeTotal;
    }

    function deliver(uint256 tAmount) public {
        address sender = _msgSender();
        require(!_isExcluded[sender], "Excluded addresses cannot call this function");
        (uint256 rAmount,,,,,,) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender]-(rAmount);
        _rTotal = _rTotal-(rAmount);
        _tFeeTotal = _tFeeTotal+(tAmount);
    }

    function excludeFromLottoRewards(address addy) public onlyOwner {
        require(_isLottoExcluded[addy] == false, "User already excluded from lotto rewards");
        _isLottoExcluded[addy] = true;
    }

    function excludeFromMaxWallet(address addy) public onlyOwner {
        _isExcludedFromMaxWallet[addy] = true;
    }

    function includeInMaxWallet(address addy) public onlyOwner {
        _isExcludedFromMaxWallet[addy] = true;
    }

    function includeInLottoRewards(address addy) public onlyOwner {
        require(_isLottoExcluded[addy] == true, "User already included in lotto rewards");
        _isLottoExcluded[addy] = false;
    }

    function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256) {
        require(tAmount <= _tTotal, "Amount must be less than supply");
        if (!deductTransferFee) {
            (uint256 rAmount,,,,,,) = _getValues(tAmount);
            return rAmount;
        } else {
            (,uint256 rTransferAmount,,,,,) = _getValues(tAmount);
            return rTransferAmount;
        }
    }

    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Amount must be less than total reflections");
        uint256 currentRate =  _getRate();
        return rAmount/(currentRate);
    }

    function setDevAddress(address dev) public onlyOwner() {
        _devWallet = payable(dev);
    }

    function setEcosystemAddress(address ecosystem) external onlyOwner {
        _ecosystemWallet = payable(ecosystem);
    }

    function setMinLottoBalance(uint256 minBalance) public onlyOwner() {
        _minLottoBalance = minBalance * 10**9;
    }

    function excludeFromReward(address account) public onlyOwner() {
        // require(account != 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D, 'We can not exclude Uniswap router.');
        require(!_isExcluded[account], "Account is already excluded");
        if(_rOwned[account] > 0) {
            _tOwned[account] = tokenFromReflection(_rOwned[account]);
        }
        _isExcluded[account] = true;
        _excluded.push(account);
    }

    function includeInReward(address account) external onlyOwner() {
        require(_isExcluded[account], "Account is already included");
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_excluded[i] == account) {
                _excluded[i] = _excluded[_excluded.length - 1];
                _tOwned[account] = 0;
                _isExcluded[account] = false;
                _excluded.pop();
                break;
            }
        }
    }

    function _transferBothExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity, uint256 tLotto) = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender]-(tAmount);
        _rOwned[sender] = _rOwned[sender]-(rAmount);
        _tOwned[recipient] = _tOwned[recipient]+(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient]+(rTransferAmount);
        _takeEcosystem(tLiquidity);
        _takeLotto(tLotto);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function excludeFromFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = true;
    }

    function excludeFromMaxTx(address account) public onlyOwner {
        _isExcludedFromMaxTx[account] = true;
    }

    function includeInMaxTx(address account) public onlyOwner {
        _isExcludedFromMaxTx[account] = false;
    }

    function includeInFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = false;
    }

    function setReflectionTaxPercent(uint256 taxFee) external onlyOwner() {
        _taxFee = taxFee;
    }

    function setLottoTaxPercent(uint256 lottoFee) external onlyOwner() {
        _jackpotFee = lottoFee;
    }

    function setPercentOfSwapIsEcosystem(uint256 percentOfSwapIsEcosystem) external onlyOwner() {
        _percentOfSwapIsEcosystem = percentOfSwapIsEcosystem;
    }

    function setEcosystemLottoDevFee(uint256 ecosystemLottoDevFee) external onlyOwner() {
        _ecosystemLottoDevFee = ecosystemLottoDevFee;
    }

    function setLottoFeePercent(uint256 percentOfSwapIsLotto) external onlyOwner() {
        _percentOfSwapIsLotto = percentOfSwapIsLotto;
    }

    function setMaxTxAmount(uint256 maxTxAmount) external onlyOwner() {
        _maxTxAmount = maxTxAmount*10**9;
    }

    function setSwapAndLiquifyEnabled(bool _enabled) public onlyOwner {
        swapAndLiquifyEnabled = _enabled;
        emit SwapAndLiquifyEnabledUpdated(_enabled);
    }

     //to recieve ETH from uniswapV2Router when swaping
    receive() external payable {}

    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal-(rFee);
        _tFeeTotal = _tFeeTotal+(tFee);
    }

    struct TData {
        uint256 tAmount;
        uint256 tFee;
        uint256 tLiquidity;
        uint256 tLotto;
        uint256 currentRate;
    }


    function _getValues(uint256 tAmount) private view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256) {
        (uint256 tTransferAmount, TData memory data) = _getTValues(tAmount);
        data.tAmount = tAmount;
        data.currentRate = _getRate();
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee) = _getRValues(data);
        return (rAmount, rTransferAmount, rFee, tTransferAmount, data.tFee, data.tLiquidity, data.tLotto);
    }

    function _getTValues(uint256 tAmount) private view returns (uint256, TData memory) {
        uint256 tFee = calculateTaxFee(tAmount);
        uint256 tLiquidity = calculateLiquidityFee(tAmount);

        uint256 tLotto = calculateLottoFee(tAmount);

        uint256 tTransferAmount = tAmount-(tFee)-(tLiquidity)-(tLotto);
        return (tTransferAmount, TData(0, tFee, tLiquidity, tLotto, 0));
    }

    function _getRValues( TData memory _data) private pure returns (uint256, uint256, uint256) {
        uint256 rAmount = _data.tAmount*(_data.currentRate);
        uint256 rFee = _data.tFee*(_data.currentRate);
        uint256 rLiquidity = _data.tLiquidity*(_data.currentRate);
        uint256 rLotto = _data.tLotto*(_data.currentRate);
        uint256 rTransferAmount = rAmount-(rFee)-(rLiquidity)-(rLotto);
        return (rAmount, rTransferAmount, rFee);
    }

    function _getRate() private view returns(uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply/(tSupply);
    }

    function _getCurrentSupply() private view returns(uint256, uint256) {
        uint256 rSupply = _rTotal;
        uint256 tSupply = _tTotal;
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_rOwned[_excluded[i]] > rSupply || _tOwned[_excluded[i]] > tSupply) return (_rTotal, _tTotal);
            rSupply = rSupply-(_rOwned[_excluded[i]]);
            tSupply = tSupply-(_tOwned[_excluded[i]]);
        }
        if (rSupply < _rTotal/(_tTotal)) return (_rTotal, _tTotal);
        return (rSupply, tSupply);
    }

    function _takeEcosystem(uint256 tLiquidity) private {
        uint256 currentRate =  _getRate();
        uint256 rLiquidity = tLiquidity*currentRate;
        _rOwned[address(this)] = _rOwned[address(this)]+rLiquidity;
        if(_isExcluded[address(this)])
            _tOwned[address(this)] = _tOwned[address(this)]+tLiquidity;
    }

	function addAddress(address adr) private {
        if(!_AddressExists[adr]){
            _AddressExists[adr] = true;
            _addressList.push(adr);
        }
    }

    function _takeLotto(uint256 tLotto) private {
        uint256 currentRate =  _getRate();
        uint256 rLotto = tLotto*currentRate;
        _rOwned[address(this)] = _rOwned[address(this)]+rLotto;
        if(_isExcluded[address(this)])
            _tOwned[address(this)] = _tOwned[address(this)]+tLotto;
    }

    function calculateTaxFee(uint256 _amount) private view returns (uint256) {
        return _amount*(_taxFee)/(
            10**2
        );
    }

    function calculateLottoFee(uint256 _amount) private view returns (uint256) {
        return _amount*(_jackpotFee)/(
            10**2
        );
    }

    function calculateLiquidityFee(uint256 _amount) private view returns (uint256) {
        return _amount*(_ecosystemLottoDevFee)/(
            10**2
        );
    }

    function removeAllFee() private {
        if(_taxFee == 0 && _ecosystemLottoDevFee == 0 && _jackpotFee == 0) return;

        _previousTaxFee = _taxFee;
        _previousJackpotFee = _jackpotFee;
        _previousEcosystemLottoDevFee = _ecosystemLottoDevFee;

        _taxFee = 0;
        _jackpotFee = 0;
        _ecosystemLottoDevFee = 0;
    }

    function restoreAllFee() private {
        _taxFee = _previousTaxFee;
        _jackpotFee = _previousJackpotFee;
        _ecosystemLottoDevFee = _previousEcosystemLottoDevFee;
    }

    function isExcludedFromFee(address account) public view returns(bool) {
        return _isExcludedFromFee[account];
    }

    function isExcludedFromMaxTx(address account) public view returns(bool) {
        return _isExcludedFromMaxTx[account];
    }

    function setNumTokensSellToAddToLiquidity(uint256 _numTokensSellToAddToLiquidity) public onlyOwner{
        numTokensSellToAddToLiquidity = _numTokensSellToAddToLiquidity*10**9;
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) private {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        if(from != owner() && to != owner() && !_isExcludedFromMaxTx[from] && !_isExcludedFromMaxTx[to])
            require(amount <= _maxTxAmount, "Transfer amount exceeds the maxTxAmount.");

        if(from != owner() && to != owner() && !_isExcludedFromMaxWallet[to])
            require(balanceOf(to)+(amount) <= _maxWalletAmount, "Transfer amount makes wallet hold more than max.");

        uint256 contractTokenBalance = balanceOf(address(this));

        if(contractTokenBalance >= _maxTxAmount)
        {
            contractTokenBalance = _maxTxAmount;
        }

        bool overMinTokenBalance = contractTokenBalance >= numTokensSellToAddToLiquidity;
        if (
            overMinTokenBalance &&
            !inSwapAndLiquify &&
            from != uniswapV2Pair &&
            swapAndLiquifyEnabled
        ) {
            contractTokenBalance = numTokensSellToAddToLiquidity;
            //add liquidity
            swapAndLiquify(contractTokenBalance);
        }else{
            //check jackpot threshold and lotto state here

        }

        //indicates if fee should be deducted from transfer
        bool takeFee = true;

        //if any account belongs to _isExcludedFromFee account then remove the fee
        if(_isExcludedFromFee[from] || _isExcludedFromFee[to]){
            takeFee = false;
        }

		addAddress(from);
		addAddress(to);

        //transfer amount, it will take tax, burn, liquidity fee
        _tokenTransfer(from,to,amount,takeFee);
    }

    function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
        //SWAP TO ETH
        uint256 initialBalance = address(this).balance;
        swapTokensForEth(initialBalance);
        //amount of ETH swapped into
        uint256 deltaBalance = address(this).balance;

        //get the percentage split for Ecosystem, and Lotto
        uint256 ecosystemETHAmount = (deltaBalance*_percentOfSwapIsEcosystem)/100;
        uint256 jackpotETHAmount = (deltaBalance*_percentOfSwapIsLotto)/100;

        //swap to jackpot token
        swapEthForJackpotToken(jackpotETHAmount);

        //send ETH to ecosystem and dev
        _ecosystemWallet.transfer(ecosystemETHAmount);
        _devWallet.transfer(deltaBalance-ecosystemETHAmount-jackpotETHAmount);

        //emit SwapAndLiquify(half, ethToBeAddedToLiquidity, otherHalf);
    }

    // function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
    //     uint256 autoLpAmount = contractTokenBalance*(_percentOfSwapIsLP)/(100);

    //     // split the contract balance into halves
    //     uint256 half = autoLpAmount/(2);
    //     uint256 otherHalf = autoLpAmount-(half);

    //     uint256 amountForDev = contractTokenBalance-(half)-(otherHalf);

    //      uint256 tokenAmountToBeSwapped = amountForDev+(otherHalf);

    //     uint256 initialBalance = address(this).balance;

    //     swapTokensForEth(tokenAmountToBeSwapped);

    //     uint256 deltaBalance = address(this).balance-(initialBalance);


    //     uint256 lpEthRatio = otherHalf*(100)/(tokenAmountToBeSwapped);

    //     uint256 ethToBeAddedToLiquidity = deltaBalance*(lpEthRatio)/(100);

    //     addLiquidity(half, ethToBeAddedToLiquidity);

    //     _devWallet.transfer(deltaBalance-ethToBeAddedToLiquidity);

    //     emit SwapAndLiquify(half, ethToBeAddedToLiquidity, otherHalf);
    // }

    function swapTokensForEth(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }

    function swapEthForJackpotToken(uint256 ethAmount) private {
        // generate the uniswap pair path of weth -> token
        address[] memory path = new address[](2);
        path[0] = uniswapV2Router.WETH();
        path[1] = JACKPOT_TOKEN;

        // make the swap
        uniswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
            0, // accept any amount of token
            path,
            address(this),
            block.timestamp
        );
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            owner(),
            block.timestamp
        );
    }

    function _checkLiquidityAdd(address from, address to) private {
        require(!_hasLiqBeenAdded, "Liquidity already added and marked.");
        if (!_hasLimits(from, to) && to == uniswapV2Pair) {
            _liqAddBlock = block.number;
            _hasLiqBeenAdded = true;

            swapAndLiquifyEnabled = true;
            emit SwapAndLiquifyEnabledUpdated(true);
        }
    }

    function _hasLimits(address from, address to) private view returns (bool) {
        return from != owner()
            && to != owner()
            && to != DEAD
            && to != address(0)
            && from != address(this);
    }

    function excludeSniper(address sniper) public onlyOwner{
        require(_isSniperOrBlacklisted[sniper], "Address not considered a sniper.");
        _isSniperOrBlacklisted[sniper] = false;
        snipersCaught --;
    }

    function includeSniper(address sniper) public onlyOwner{
        require(!_isSniperOrBlacklisted[sniper], "Address already considered a sniper.");
        _isSniperOrBlacklisted[sniper] = true;
        snipersCaught ++;
    }

    function flipSniperProtection() public onlyOwner{
        sniperProtection = !sniperProtection;
    }

    //this method is responsible for taking all fee, if takeFee is true and checking/banning bots
    function _tokenTransfer(address sender, address recipient, uint256 amount,bool takeFee) private {
        if (sniperProtection){
            if (_isSniperOrBlacklisted[sender] || _isSniperOrBlacklisted[recipient]) {
                revert("Sniper rejected.");
            }
            if (!_hasLiqBeenAdded) {
                _checkLiquidityAdd(sender, recipient);
                if (!_hasLiqBeenAdded && _hasLimits(sender, recipient)) {
                    revert("Only owner can transfer at this time.");
                }
            } else {
                if (_liqAddBlock > 0
                    && sender == uniswapV2Pair
                    && _hasLimits(sender, recipient)
                ) {
                    if (block.number - _liqAddBlock < snipeBlockAmt) {
                        _isSniperOrBlacklisted[recipient] = true;
                        snipersCaught ++;
                        emit SniperCaught(recipient);
                    }
                }
            }
        }

        if(!takeFee)
            removeAllFee();

        if (_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferFromExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
            _transferToExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferStandard(sender, recipient, amount);
        } else if (_isExcluded[sender] && _isExcluded[recipient]) {
            _transferBothExcluded(sender, recipient, amount);
        } else {
            _transferStandard(sender, recipient, amount);
        }

        if(!takeFee)
            restoreAllFee();
    }

    function _transferStandard(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity, uint256 tLotto) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender]-(rAmount);
        _rOwned[recipient] = _rOwned[recipient]+(rTransferAmount);
        _takeEcosystem(tLiquidity);

        _takeLotto(tLotto);

        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferToExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity, uint256 tLotto) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender]-(rAmount);
        _tOwned[recipient] = _tOwned[recipient]+(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient]+(rTransferAmount);
        _takeEcosystem(tLiquidity);
        _takeLotto(tLotto);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferFromExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tLiquidity, uint256 tLotto) = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender]-(tAmount);
        _rOwned[sender] = _rOwned[sender]-(rAmount);
        _rOwned[recipient] = _rOwned[recipient]+(rTransferAmount);
        _takeEcosystem(tLiquidity);
        _takeLotto(tLotto);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    /**
    * Callback function used by VRF Coordinator
    */
    function fulfillRandomness(bytes32 _requestId, uint256 randomness) internal override {
        require (requestId == _requestId, "requestId doesn't match");
        
        //randomResult = randomness;
        
        //_changeState(LotteryState.Ready);
        
        //emit GotRandom(randomResult);
    }

    function _changeState(LotteryState _newState) private {
        state = _newState;
        emit LotteryStateChanged(state);
    }
}

