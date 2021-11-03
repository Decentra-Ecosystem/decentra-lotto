pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";


// SPDX-License-Identifier: Unlicensed

interface IERC20 {

    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    /**
     * @dev Returns the decimals.
     */
    function decimals() external view returns (uint256);
    
    /**
     * @dev Returns the symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}



/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
 


abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}


/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain`call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
      return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        return _functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        return _functionCallWithValue(target, data, value, errorMessage);
    }

    function _functionCallWithValue(address target, bytes memory data, uint256 weiValue, string memory errorMessage) private returns (bytes memory) {
        require(isContract(target), "Address: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{ value: weiValue }(data);
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract Ownable is Context {
    address private _owner;
    address private _previousOwner;
    uint256 private _lockTime;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

     /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function geUnlockTime() public view returns (uint256) {
        return _lockTime;
    }

    //Locks the contract for owner for the amount of time provided
    function lock(uint256 time) public virtual onlyOwner {
        _previousOwner = _owner;
        _owner = address(0);
        _lockTime = now + time;
        emit OwnershipTransferred(_owner, address(0));
    }
    
    //Unlocks the contract for owner when _lockTime is exceeds
    function unlock() public virtual {
        require(_previousOwner == msg.sender, "You don't have permission to unlock");
        require(now > _lockTime , "Contract is locked until 7 days");
        emit OwnershipTransferred(_owner, _previousOwner);
        _owner = _previousOwner;
        _previousOwner = address(0);
    }
}

// pragma solidity >=0.5.0;

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}


// pragma solidity >=0.5.0;

interface IUniswapV2Pair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;

    function initialize(address, address) external;
}

// pragma solidity >=0.6.2;

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}



// pragma solidity >=0.6.2;

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

//DecentraLotto Interface
interface DecentraLotto {
  function CHARITY_WALLET (  ) external view returns ( address );
  function _burnFee (  ) external view returns ( uint256 );
  function _charityFee (  ) external view returns ( uint256 );
  function _liquidityFee (  ) external view returns ( uint256 );
  function _maxTxAmount (  ) external view returns ( uint256 );
  function _previousCharityFee (  ) external view returns ( uint256 );
  function _tBurnTotal (  ) external view returns ( uint256 );
  function _taxFee (  ) external view returns ( uint256 );
  function allowance ( address owner, address spender ) external view returns ( uint256 );
  function approve ( address spender, uint256 amount ) external returns ( bool );
  function balanceOf ( address account ) external view returns ( uint256 );
  function buybackBurn ( uint256 amount ) external;
  function decimals (  ) external pure returns ( uint8 );
  function decreaseAllowance ( address spender, uint256 subtractedValue ) external returns ( bool );
  function excludeFromFee ( address account ) external;
  function excludeFromReward ( address account ) external;
  function geUnlockTime (  ) external view returns ( uint256 );
  function includeInFee ( address account ) external;
  function includeInReward ( address account ) external;
  function increaseAllowance ( address spender, uint256 addedValue ) external returns ( bool );
  function isExcludedFromFee ( address account ) external view returns ( bool );
  function isExcludedFromReward ( address account ) external view returns ( bool );
  function lock ( uint256 time ) external;
  function name (  ) external pure returns ( string memory );
  function owner (  ) external view returns ( address );
  function reflectionFromToken ( uint256 tAmount, bool deductTransferFee ) external view returns ( uint256 );
  function renounceOwnership (  ) external;
  function setCharityFeePercent ( uint256 charityFee ) external;
  function setCharityWallet ( address _charityWallet ) external;
  function setLiquidityFeePercent ( uint256 liquidityFee ) external;
  function setMaxTxPercent ( uint256 maxTxPercent ) external;
  function setRouterAddress ( address newRouter ) external;
  function setSwapAndLiquifyEnabled ( bool _enabled ) external;
  function setTaxFeePercent ( uint256 taxFee ) external;
  function swapAndLiquifyEnabled (  ) external view returns ( bool );
  function symbol (  ) external pure returns ( string memory );
  function tokenFromReflection ( uint256 rAmount ) external view returns ( uint256 );
  function totalDonated (  ) external view returns ( uint256 );
  function totalFees (  ) external view returns ( uint256 );
  function totalSupply (  ) external view returns ( uint256 );
  function transfer ( address recipient, uint256 amount ) external returns ( bool );
  function transferFrom ( address sender, address recipient, uint256 amount ) external returns ( bool );
  function transferOwnership ( address newOwner ) external;
  function uniswapV2Pair (  ) external view returns ( address );
  function uniswapV2Router (  ) external view returns ( address );
  function unlock (  ) external;
  function withdrawEth ( uint256 amount ) external;
}

interface DELOStaking {
    function ADDFUNDS(uint256 tokens) external;
}

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
        ) public
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

contract DrawInterface {
    struct NewDraw {
        uint id;
        uint numParticipants;
        address[] tickets;
        address[] winners;
        uint numTickets;
        uint256 totalSpend;
        mapping (address => uint) walletSpendBNB;
        mapping (address => uint) walletNumTickets;
        mapping (address => uint) walletWinAmount;
        mapping (address => uint) walletCharityTickets;
        // A unix timestamp, denoting the created datetime of this draw
        uint256 createdOn;
        // A unix timestamp, denoting the end of the draw
        uint256 drawDeadline;
        uint256 totalPot;
        LotteryState state;
    }  
    
    enum LotteryState{
        Open,
        Closed,
        Ready,
        Finished
    }
}

contract DecentraLottoDraw is Context, Ownable, RandomNumberConsumer, DrawInterface {
    using Address for address;
    
    IERC20 weth;
    DecentraLotto delo;
    DELOStaking deloStaking;
    
    address public deloAddress = 0x7909B1652cb4f71E1a38568d8cC965cfC3A3FEc9;
    address public deloStakingAddress = 0xBF1B38b7eCbEDd2236fA8922e632f8a7f662D120;
    
    address public peg = 0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7; // busd
    address public wethAddress = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd; //wbnb
    
    address public megadrawWallet = 0xdcf5C8273b57D0d227724DD2aC9A0ce010412d0f;
    
    mapping (address => bool) public stablesAccepted;
    
    uint public drawLength;
    mapping (uint => NewDraw) public draws;
    uint256 public currentDraw = 0;

    mapping (address => uint256) public walletTotalTicketsPurchased;
    mapping (address => uint256) public walletTotalSpendBNB;
    
    mapping (address => uint256) public walletTotalWins;
    mapping (address => uint256) public walletTotalWinValueDelo;
    
    mapping (address => uint) public walletTotalCharityTickets;
    mapping (address => bool) public charityRecipients;
    mapping (address => uint256) public totalAirdropsReceived;
    
    uint256 public totalSpend = 0;
    
    uint public maxTicketsPerTxn = 60;
    uint256 public priceOneTicket = 10 *10**18;
    uint256 public discountFiveTickets = 5;
    uint256 public discountTenTickets = 10;
    uint256 public discountTwentyTickets = 20;
    
    uint public liquidityDivisor = 20; //5%
    uint public marketingDivisor = 10; //10%
    uint public hedgeDivisor = 10; //10%
    uint public stakingDivisor = 5; //20%
    uint public megadrawDivisor = 10; //10%
    bool public takeLiquidity = true;
    bool public takeMarketing = false;
    bool public takeHedge = true;
    bool public takeStaking = true;
    bool public takeMegadraw = true;
    
    uint public maxWinners = 40;
    bytes32 private requestId;
    
    IUniswapV2Router02 public uniswapV2Router;
    bool private inSwapAndLiquify;

    constructor () 
        RandomNumberConsumer(
            0xa555fC018435bef5A13C6c6870a9d4C11DEC329C, //vrfCoordinator
            0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06, //link address
            0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, //key hash
            0.1 * 10 ** 18 //fee
        ) public {
        uniswapV2Router = IUniswapV2Router02(0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3);
        delo = DecentraLotto(deloAddress);
        deloStaking = DELOStaking(deloStakingAddress);
        weth = IERC20(wethAddress);
        drawLength = 1 * 1 weeks;
        stablesAccepted[0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7] = true; //busd testnet
        stablesAccepted[0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867] = true; //dai testnet
        stablesAccepted[0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684] = true; //usdt testnet
        stablesAccepted[0x9780881Bf45B83Ee028c4c1De7e0C168dF8e9eEF] = true; //usdc testnet
        createNextDraw();
    }
    
    event LotteryStateChanged(LotteryState newState);
    
    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiquidity
    );
    
    event TicketsBought(address indexed user, uint256 amount);
    event GetRandom(bytes32 requestId);
    event GotRandom(uint256 randomNumber);
    event WinnerPaid(address indexed user, uint256 amount);
    event DrawCreated(uint256 id);
    
    modifier isState(LotteryState _state){
        NewDraw storage draw = draws[currentDraw];
        require(draw.state == _state, "Wrong state for this action");
        _;
    }
    
    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }
    
    function _changeState(LotteryState _newState) private {
        NewDraw storage draw = draws[currentDraw];
        draw.state = _newState;
        emit LotteryStateChanged(draw.state);
    }
    
    function setMaxTicketsPerTxn(uint _maxTicketsPerTxn) external onlyOwner{
        maxTicketsPerTxn = _maxTicketsPerTxn;
    }
    
    function setMaxWinners(uint amt) external onlyOwner{
        maxWinners = amt;
    }
    
    function setMegadrawWallet(address _address) external onlyOwner{
        megadrawWallet = _address;
    }
    
    function setDeloStakingAddress(address _address) external onlyOwner{
        deloStakingAddress = _address;
        deloStaking = DELOStaking(deloStakingAddress);
    }
    
    function setPegAddress(address _address) external onlyOwner{
        peg = _address;
    }
    
    function setWETHAddress(address _address) external onlyOwner{
        wethAddress = _address;
    }
    
    function setRouterAddress(address newRouter) external onlyOwner() {
        IUniswapV2Router02 _newPancakeRouter = IUniswapV2Router02(newRouter);
        uniswapV2Router = _newPancakeRouter;
    }
    
    function setTicketPrice(uint256 _priceOneTicket) external onlyOwner{
        priceOneTicket = _priceOneTicket;
    }
    
    function setDiscounts(uint _discountFiveTickets, uint _discountTenTickets, uint _discountTwentyTickets) external onlyOwner{
        discountFiveTickets = _discountFiveTickets;
        discountTenTickets = _discountTenTickets;
        discountTwentyTickets = _discountTwentyTickets;
    }
    
    function addCharityRecipient(address _charity) external onlyOwner{
        charityRecipients[_charity] = true;
    }
    
    function removeCharityRecipient(address _charity) external onlyOwner{
        charityRecipients[_charity] = false;
    }
    
    function setLiquidityDivisor(uint256 _liqdiv) external onlyOwner{
        liquidityDivisor = _liqdiv;
    }
    
    function setMarketingDivisor(uint256 _markdiv) external onlyOwner{
        require(_markdiv >= 5, "Cannot set over 20% marketing allocation");
        marketingDivisor = _markdiv;
    }
    
    function setHedgeDivisor(uint256 _hedgediv) external onlyOwner{
        hedgeDivisor = _hedgediv;
    }
    
    function setStakingDivisor(uint256 _stakingdiv) external onlyOwner{
        stakingDivisor = _stakingdiv;
    }
    
    function setMegadrawDivisor(uint256 _megadrawDivisor) external onlyOwner{
        megadrawDivisor = _megadrawDivisor;
    }
    
    function toggleTakeLiquidity(bool _liq) external onlyOwner{
        takeLiquidity = _liq;
    }
    
    function toggleTakeMarketing(bool _mark) external onlyOwner{
        takeMarketing = _mark;
    }
    
    function toggleTakeHedge(bool _hedge) external onlyOwner{
        takeHedge = _hedge;
    }
    
    function toggleTakeStaking(bool _takeStaking) external onlyOwner{
        takeStaking = _takeStaking;
    }
    
    function toggleTakeMegadraw(bool _takeMegadraw) external onlyOwner{
        takeMegadraw = _takeMegadraw;
    }
    
    function removeStablePayment(address _stable) external onlyOwner{
        stablesAccepted[_stable] = false;
    }
    
    //withdraw dust
    function withdrawBNB(uint256 amount) external onlyOwner {
        msg.sender.transfer(amount);
    }
    
    //withdraw token link or trapped tokens
    function withdrawToken(address _address, uint256 amount) external onlyOwner {
        // Ensure requested tokens isn't DELO (cannot withdraw the pot)
        require(_address != deloAddress, "Cannot withdraw Lottery pot");
        IERC20 token = IERC20(_address);
        token.transfer(msg.sender, amount);
    }
    
    function setDrawLength(uint multiplier, uint unit) external onlyOwner returns(bool){
        if (unit == 1){
            drawLength = multiplier * 1 seconds;
        }else if (unit == 2){
            drawLength = multiplier * 1 minutes;
        }else if (unit == 3){
            drawLength = multiplier * 1 hours;
        }else if (unit == 4){
            drawLength = multiplier * 1 days;
        }else if (unit == 5){
            drawLength = multiplier * 1 weeks;
        }
        
        return true;
    }
    
    function updateLengthOfCurrentDraw(uint multiplier, uint unit) external onlyOwner returns(bool){
        NewDraw storage draw = draws[currentDraw];
        uint dlen;
        if (unit == 1){
            dlen = multiplier * 1 seconds;
        }else if (unit == 2){
            dlen = multiplier * 1 minutes;
        }else if (unit == 3){
            dlen = multiplier * 1 hours;
        }else if (unit == 4){
            dlen = multiplier * 1 days;
        }else if (unit == 5){
            dlen = multiplier * 1 weeks;
        }
        draw.drawDeadline = draw.createdOn + dlen;
        return true;
    }
    
    function getWalletWinAmountForDraw(uint _id, address winner) external view returns(uint){
        NewDraw storage draw = draws[_id];
        return draw.walletWinAmount[winner];
    }
    
    function getDrawStats(uint _id) external view returns(uint, uint, address[] memory, address[] memory, uint256, uint256, uint256, uint256, uint256, LotteryState, uint){
        NewDraw storage draw = draws[_id];
        return (
            draw.id, 
            draw.numParticipants, 
            draw.tickets,
            draw.winners,
            draw.numTickets, 
            draw.totalSpend,
            draw.createdOn, 
            draw.drawDeadline,
            draw.totalPot,
            draw.state,
            getNumberWinners()
        );
    }
    
    function getDrawStats() external view returns(uint, uint, address[] memory, address[] memory, uint256, uint256, uint256, uint256, uint256, LotteryState, uint){
        NewDraw storage draw = draws[currentDraw];
        return (
            draw.id, 
            draw.numParticipants, 
            draw.tickets,
            draw.winners,
            draw.numTickets, 
            draw.totalSpend,
            draw.createdOn, 
            draw.drawDeadline, 
            draw.totalPot,
            draw.state,
            getNumberWinners()
        );
    }
    
    function getWalletDrawCharityStats(uint _id, address _address) external view returns(uint256){
        NewDraw storage draw = draws[_id];
        return draw.walletCharityTickets[_address];
    }
    
    function getWalletDrawCharityStats(address _address) external view returns(uint256){
        NewDraw storage draw = draws[currentDraw];
        return draw.walletCharityTickets[_address];
    }
    
    function getDrawWalletStats(uint _id) external view returns (uint, uint, uint, uint256, uint256, uint256, uint256, uint256, uint256){
        NewDraw storage draw = draws[_id];
        return (
            draw.walletSpendBNB[msg.sender], 
            draw.walletNumTickets[msg.sender],
            draw.walletCharityTickets[msg.sender],
            walletTotalSpendBNB[msg.sender],
            walletTotalTicketsPurchased[msg.sender],
            walletTotalWins[msg.sender],
            walletTotalWinValueDelo[msg.sender],
            walletTotalCharityTickets[msg.sender],
            totalAirdropsReceived[msg.sender]
        );
    }
    
    function getDrawWalletStats() external view returns (uint, uint, uint, uint256, uint256, uint256, uint256, uint256, uint256){
        NewDraw storage draw = draws[currentDraw];
        return (
            draw.walletSpendBNB[msg.sender], 
            draw.walletNumTickets[msg.sender],
            draw.walletCharityTickets[msg.sender],
            walletTotalSpendBNB[msg.sender],
            walletTotalTicketsPurchased[msg.sender],
            walletTotalWins[msg.sender],
            walletTotalWinValueDelo[msg.sender],
            walletTotalCharityTickets[msg.sender],
            totalAirdropsReceived[msg.sender]
        );
    }
    
    function getCurrentPot() external view returns(uint256){
        uint256 deloBal = delo.balanceOf(address(this));
        return deloBal - deloBal.div(liquidityDivisor);
    }
    
    function createNextDraw() private returns(bool){
        currentDraw = currentDraw + 1;
        NewDraw storage draw = draws[currentDraw];
        draw.id = currentDraw;
        draw.createdOn = now;
        draw.drawDeadline = draw.createdOn + drawLength;
        draw.numParticipants = 0;
        draw.totalSpend = 0;
        _changeState(LotteryState.Open);
        emit DrawCreated(draw.id);
    }
    
    function getNumberWinners() public view returns(uint){
        uint numWinners = 0;
        uint256 deloCost = getTicketCostInDelo();
        uint256 bal = delo.balanceOf(address(this)).div(2);
        while (bal >= deloCost && numWinners <= maxWinners){
            bal = bal.sub(bal.div(2));
            numWinners++;
        }
        return numWinners;
    }
    
    function drawWinners() public isState(LotteryState.Ready) returns(bool){
        NewDraw storage draw = draws[currentDraw];
        
        _changeState(LotteryState.Finished);

        //seed for abi encoding random number
        uint seed = 1;
        
        //only execute while the winning amount * 2 is more than the balance
        uint256 deloCost = getTicketCostInDelo();
        
        draw.totalPot = delo.balanceOf(address(this));
        
        while (delo.balanceOf(address(this)).div(2) >= deloCost && seed <= maxWinners){
            //pick a random winner
            address winner = winnersRemoveAt(uint256(keccak256(abi.encode(randomResult, seed))).mod(draw.tickets.length));
            //add them to the winners array
            draw.winners.push(winner);
            //increment their wins
            walletTotalWins[winner]++;
            //add their win value
            uint256 amt = delo.balanceOf(address(this)).div(2);
            walletTotalWinValueDelo[winner] += amt;
            draw.walletWinAmount[winner] += amt;
            //transfer their winnings
            delo.transfer(winner, amt);
            //increment the seed
            seed = seed + 1;
            emit WinnerPaid(winner, amt);
        }
        
        randomResult = 0;

        createNextDraw();
    }
    
    //fast removal - copy pop approach
    function winnersRemoveAt(uint index) internal returns(address){
        NewDraw storage draw = draws[currentDraw];
        require(index < draw.tickets.length);
        //save the winner address
        address winner = draw.tickets[index];
        // Move the last element into the place to winners index
        draw.tickets[index] = draw.tickets[draw.tickets.length - 1];
        // Remove the last element to reduce the array size
        draw.tickets.pop();
        return winner;
    }
    
    /**
        * Callback function used by VRF Coordinator
    */
    function fulfillRandomness(bytes32 _requestId, uint256 randomness) internal override {
        require (requestId == _requestId, "requestId doesn't match");
        
        randomResult = randomness;
        
        _changeState(LotteryState.Ready);
        
        emit GotRandom(randomResult);
    }
    
    function endDrawAndGetRandom() external isState(LotteryState.Open) returns(bool){
        NewDraw storage draw = draws[currentDraw];
        require (now > draw.drawDeadline, 'Draw deadline not yet reached');
        
        _changeState(LotteryState.Closed);
        
        //take liquidityDivisor of the total jackpot and add it to liquidity of the DELO token
        uint256 jackpotTotal = delo.balanceOf(address(this));
        if (takeLiquidity == true && inSwapAndLiquify == false){
            //% to liquidity
            swapAndLiquify(jackpotTotal.div(liquidityDivisor));
        }
        
        //get random number
        requestId = getRandomNumber();
        
        GetRandom(requestId);
        
        return true;
    }
    
    function getPriceForTickets(address tokenAddress, uint numTickets) public view returns(uint256){
        uint256 cost = 0;
        uint256 price;
        if (numTickets >= 20){
            price = priceOneTicket - priceOneTicket.mul(discountTwentyTickets).div(100);
        }else if(numTickets >= 10){
            price = priceOneTicket - priceOneTicket.mul(discountTenTickets).div(100);
        }else if(numTickets >= 5){
            price = priceOneTicket - priceOneTicket.mul(discountFiveTickets).div(100);
        }else{
            price = priceOneTicket;
        }
        
        //returns the amount of bnb needed
        if (tokenAddress == uniswapV2Router.WETH()){
            address[] memory path = new address[](2);
            path[0] = uniswapV2Router.WETH();
            path[1] = peg;
            uint256[] memory amountIn = uniswapV2Router.getAmountsIn(price, path);
            cost = amountIn[0] * numTickets;
        }else{
            if (stablesAccepted[tokenAddress] == true){
                cost = price * numTickets;
            }else{
                revert('Stable not accepted as payment');
            }
        }
        return cost;
    }
    
    function getDELOValueInPeg(uint256 amt) external view returns(uint256[] memory){
        address[] memory path = new address[](3);
        path[0] = deloAddress;
        path[1] = uniswapV2Router.WETH();
        path[2] = peg;
        uint256[] memory amountOut = uniswapV2Router.getAmountsOut(amt, path);
        return amountOut;
    }
    
    function getDELOValueInBNB(uint256 amt) external view returns(uint256[] memory){
        address[] memory path = new address[](2);
        path[0] = deloAddress;
        path[1] = uniswapV2Router.WETH();
        uint256[] memory amountOut = uniswapV2Router.getAmountsOut(amt, path);
        return amountOut;
    }
    
    function getBNBValueInDelo(uint256 amt) external view returns(uint256[] memory){
        address[] memory path = new address[](2);
        path[0] = uniswapV2Router.WETH();
        path[1] = deloAddress;
        uint256[] memory amountOut = uniswapV2Router.getAmountsOut(amt, path);
        return amountOut;
    }
    
    function getPEGValueInDelo(uint256 amt) external view returns(uint256[] memory){
        address[] memory path = new address[](3);
        path[0] = peg;
        path[1] = uniswapV2Router.WETH();
        path[2] = deloAddress;
        uint256[] memory amountOut = uniswapV2Router.getAmountsOut(amt, path);
        return amountOut;
    }
    
    function getTicketCostInDelo() public view returns(uint256){
        address[] memory path = new address[](3);
        path[0] = deloAddress;
        path[1] = uniswapV2Router.WETH();
        path[2] = peg;
        uint256[] memory amountIn = uniswapV2Router.getAmountsIn(priceOneTicket, path);
        return amountIn[0];
    }
    
    function buyTicketsBNB(uint numTickets, address recipient, address airDropRecipient) payable external isState(LotteryState.Open) returns(bool){
        NewDraw storage draw = draws[currentDraw];
        require (now < draw.drawDeadline, 'Ticket purchases have ended for this draw');
        require (recipient != address(0), 'Cannot buy a ticket for null address');
        require (numTickets <= maxTicketsPerTxn, 'You are trying to buy too many tickets in this TXN');
        
        uint256 cost = getPriceForTickets(wethAddress, numTickets);
        require (msg.value >= cost, 'Insufficient amount. More BNB required for purchase.');
        
        processTransaction(cost, numTickets, recipient, airDropRecipient);
        
        //refund any excess
        msg.sender.transfer(msg.value - cost);
        
        return true;
    }
    
    //approve must first be called by msg.sender
    function buyTicketsStable(address tokenAddress, uint numTickets, address recipient, address airdropRecipient) isState(LotteryState.Open) external returns(bool){
        NewDraw storage draw = draws[currentDraw];
        require (now < draw.drawDeadline, 'Ticket purchases have ended for this draw');
        require (recipient != address(0), 'Cannot buy a ticket for null address');
        require (numTickets <= maxTicketsPerTxn, 'You are trying to buy too many tickets in this TXN');
        
        uint256 price = getPriceForTickets(tokenAddress, numTickets);
        
        require (price > 0, 'Unsupported token provided as payment');
            
        IERC20 token = IERC20(tokenAddress);
        
        require(token.allowance(msg.sender, address(this)) >= price, "Check the token allowance");
        require(token.balanceOf(msg.sender) >= price, "Insufficient balance");
        
        uint256 initialTokenBal = token.balanceOf(address(this));
        token.transferFrom(msg.sender, address(this), price);
        uint256 tokenAmount = token.balanceOf(address(this)).sub(initialTokenBal);
            
        uint bnbValue = 0;
        
        // capture the contract's current ETH balance.
        // this is so that we can capture exactly the amount of ETH that the
        // swap creates, and not make the event include any ETH that
        // has been manually sent to the contract
        uint256 initialBalance = address(this).balance;
        
        swapTokensForEth(tokenAddress, tokenAmount);
        
        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance.sub(initialBalance);
        
        bnbValue = newBalance;
        
        return processTransaction(bnbValue, numTickets, recipient, airdropRecipient);
    }
    
    function assignTickets(uint256 bnbValue, uint numTickets, address receiver) isState(LotteryState.Open) private returns(bool){
        NewDraw storage draw = draws[currentDraw];
        //only add a new participant if the wallet has not purchased a ticket already
        if (draw.walletNumTickets[receiver] <= 0){
            draw.numParticipants++;
        }
        
        //add the wallet for each ticket they purchased/donated
        for (uint i=0; i < numTickets; i++){
            draw.numTickets++;
            draw.tickets.push(receiver);
            draw.walletNumTickets[receiver]++;
            walletTotalTicketsPurchased[receiver]++;
        }
        
        draw.totalSpend += bnbValue;
        draw.walletSpendBNB[receiver] += bnbValue;
        draw.totalPot = delo.balanceOf(address(this));
        
        walletTotalSpendBNB[receiver] += bnbValue;
        totalSpend += bnbValue;
        
        emit TicketsBought(receiver, numTickets);
        
        return true;
    }
    
    function processTransaction(uint256 bnbValue, uint numTickets, address recipient, address airdropRecipient) private returns(bool){
        uint256 initialTokenBal = delo.balanceOf(address(this));
        
        //take the marketing amount in bnb
        if (takeMarketing == true){
            bnbValue = bnbValue.sub(bnbValue.div(marketingDivisor));
        }
        
        //swap the bnb from the ticket sale for DELO
        swapEthForDelo(bnbValue);
        uint256 tokenAmount = delo.balanceOf(address(this)).sub(initialTokenBal);
        
        if (takeHedge == true){
            //give % of purchase back to purchaser, or to ticket recipient, or to charity recipient (if that address is authorised)
            if (airdropRecipient == msg.sender || airdropRecipient == recipient || charityRecipients[airdropRecipient] == true){
                totalAirdropsReceived[airdropRecipient] += tokenAmount.div(hedgeDivisor);
                delo.transfer(airdropRecipient, tokenAmount.div(hedgeDivisor));
            }
            //record the amount of ticket airdrops the purchaser donated to charity
            if (charityRecipients[airdropRecipient] == true){
                NewDraw storage draw = draws[currentDraw];
                draw.walletCharityTickets[msg.sender] += numTickets;
                walletTotalCharityTickets[msg.sender] += numTickets;
            }
        }
        
        if (takeMegadraw == true){
            //take megadraw % to be accumulated for megadraws
            delo.transfer(megadrawWallet, tokenAmount.div(megadrawDivisor));
        }
        
        if (takeStaking == true){
            //call the ADDFUNDS method of staking contract to reward stakers
            uint256 amt = tokenAmount.div(stakingDivisor);
            delo.approve(deloStakingAddress, amt);
            deloStaking.ADDFUNDS(amt);
        }
        
        return assignTickets(bnbValue, numTickets, recipient);
    }
    
    //to receive ETH from uniswapV2Router when swapping
    receive() external payable {}
    
    function swapTokensForEth(address _token, uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = _token;
        path[1] = uniswapV2Router.WETH();

        IERC20 token = IERC20(_token);
        token.approve(address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETH(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }
    
    function swapTokensWithFeeForEth(address _token, uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = _token;
        path[1] = uniswapV2Router.WETH();

        IERC20 token = IERC20(_token);
        token.approve(address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }
    
    function swapEthForDelo(uint256 ethAmount) private {
        // generate the uniswap pair path of weth -> token
        address[] memory path = new address[](2);
        path[0] = uniswapV2Router.WETH();
        path[1] = deloAddress;

        // make the swap
        uniswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
            0, // accept any amount of token
            path,
            address(this),
            block.timestamp
        );
    }
    
    function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
        // split the contract balance into halves
        uint256 half = contractTokenBalance.div(2);
        uint256 otherHalf = contractTokenBalance.sub(half);

        // capture the contract's current ETH balance.
        // this is so that we can capture exactly the amount of ETH that the
        // swap creates, and not make the liquidity event include any ETH that
        // has been manually sent to the contract
        uint256 initialBalance = address(this).balance;

        // swap tokens for ETH
        swapTokensWithFeeForEth(deloAddress, half); // <- this breaks the ETH -> HATE swap when swap+liquify is triggered

        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance.sub(initialBalance);

        // add liquidity to uniswap
        addLiquidity(otherHalf, newBalance);
        
        emit SwapAndLiquify(half, newBalance, otherHalf);
    }
    
    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        delo.approve(address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            deloAddress,
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this), // add liquidity to the contract
            block.timestamp
        );
    }
    
}
