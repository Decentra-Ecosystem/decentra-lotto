pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;


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
 
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

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


//Lepracoin Interface
interface Lepracoin {
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

contract DAOInterface {
    //cycle struct
    struct Cycle {
        uint id;
        string name;
        string description;
        bool active;
        uint256 taxFee; 
        uint256 liquidityFee; 
        uint256 charityFee;
        uint votes;
    }
    
    struct CycleChangeProposal {
        //cycles involved in vote
        Cycle[] votingCycles;
        // A unix timestamp, denoting the created datetime of this proposal
        uint256 createdOn;
        // A unix timestamp, denoting the end of the voting period
        uint256 votingDeadline;
        //total votes
        uint totalVotes;
        // True if the proposal's votes have yet to be counted, otherwise False
        bool open;
        // Simple mapping to check if a shareholder has voted
        mapping (address => bool) voted;
        // Mapping to check what cycle a shareholder has voted for
        mapping (address => uint) cycleVotedFor;
        //reference to store the winning cycle id. If the length==1, then there is no tiebreaker situation
        uint[] winningCycleVotes;
        uint[] winningCycleId;
    }   
    
    struct NewCycleProposal {
        uint id;
        Cycle cycle;
        // Address of the creator
        address createdBy;
        // A unix timestamp, denoting the created datetime of this proposal
        uint256 createdOn;
        // A unix timestamp, denoting the end of the voting period
        uint256 votingDeadline;
        //total votes
        uint totalVotes;
        // A hash to check validity of a proposal
        bytes32 proposalHash;
        // True if the proposal's votes have yet to be counted, otherwise False
        bool open;
        // Simple mapping to check if a shareholder has voted yes
        mapping (address => bool) votedYes;
        // Simple mapping to check if a shareholder has voted no
        mapping (address => bool) votedNo;
        // Number of votes in favor of the proposal
        uint yea;
        // Number of votes opposed to the proposal
        uint nay;
    }  
    
    event ProposalAdded(
        uint indexed proposalID,
        string name,
        string description,
        uint taxFee,
        uint liquidityFee,
        uint cherityFee
    );
}

contract LepracoinInterface is Ownable {
     //////////////Lepracoin interface
    Lepracoin lep;
    
    function lepraRenounceOwnership() public virtual onlyOwner {
        return lep.renounceOwnership();
    }
    
    function lepraTransferOwnership(address newOwner) public virtual onlyOwner {
        return lep.transferOwnership(newOwner);
    }
    
    function lepraLock(uint256 time) public virtual onlyOwner {
        return lep.lock(time);
    }
    
    function lepraSetRouterAddress(address newRouter) public onlyOwner() {
        return lep.setRouterAddress(newRouter);
    }
    
    function lepraWithdrawEth(uint amount) external onlyOwner {
        return lep.withdrawEth(amount);
    }
    
    function withdrawEth(uint amount) external onlyOwner {
        msg.sender.transfer(amount);
    }
    
    function lepraBuybackBurn(uint256 amount) external onlyOwner {
        return lep.buybackBurn(amount);
    }
    
    function lepraSetCharityWallet(address _charityWallet) public onlyOwner {
        return lep.setCharityWallet(_charityWallet);
    }
    
    function lepraExcludeFromReward(address account) public onlyOwner() {
        return lep.excludeFromReward(account);
    }
    
    function lepraIncludeInReward(address account) external onlyOwner() {
        return lep.includeInReward(account);
    }
    
    function lepraExcludeFromFee(address account) public onlyOwner {
        return lep.excludeFromFee(account);
    }
    
    function lepraIncludeInFee(address account) public onlyOwner {
        return lep.includeInFee(account);
    }
    
    function lepraSetTaxFeePercent(uint256 taxFee) internal {
        return lep.setTaxFeePercent(taxFee);
    }
    
    function lepraSetCharityFeePercent(uint256 charityFee) internal {
        return lep.setCharityFeePercent(charityFee);
    }
    
    function lepraSetLiquidityFeePercent(uint256 liquidityFee) internal {
        return lep.setLiquidityFeePercent(liquidityFee);
    }
   
    function lepraSetMaxTxPercent(uint256 maxTxPercent) external onlyOwner() {
        return lep.setMaxTxPercent(maxTxPercent);
    }

    function lepraSetSwapAndLiquifyEnabled(bool _enabled) public onlyOwner {
        return lep.setSwapAndLiquifyEnabled(_enabled);
    }
 
    function lepraGetName() public view returns (string memory) {
        return lep.name();
    }
    
    function lepraBalanceOf(address account) public view returns (uint256) {
        return lep.balanceOf(account);
    }
    
    //////////////END Lepracoin interface  
}


contract LepraDAO is Context, Ownable, DAOInterface, LepracoinInterface {
    using SafeMath for uint256;
    using Address for address;
    
    address private lepAddress = 0xcA71DdB30ddC906048bcec5dF305683F289C8C40;
    
    //used for pseudo random function
    uint private randomNonce = 1;
    
    //next cycle proposal
    uint public highestCycleId = 0;
    uint public activeCycle;
    uint public currentCycleProposal = 0;
    mapping (uint => CycleChangeProposal) cycleProposals;
    uint256 public minLepForCycleVoting = 19913800000000000;
    uint public cycleProposalLength;
    
    
    //array of cycles
    //@dev TODO: cap this array at 30 cycles. 
    //If a new cycle is proposed to passes to be added and the allCycles.length == 30, then remove a random cycle of those that got the least votes last cycle vote
    Cycle[] public allCycles;
    uint public maxCycles = 20;
    
    //new cycle proposal
    uint256 public minLepForNewCycleProposal = 199138000000000000;
    uint public newCycleProposal = 0;
    mapping (uint => NewCycleProposal) newCycleProposals;
    mapping (bytes32 => bool) uniqueProposal;
    uint public newCycleProposalLength;
    mapping (address => bool) addressHasActiveProposal;
    uint public votesNeededForValidProposal = 30;
    uint public minTax = 0;
    uint public minLiquidity = 0;
    uint public minCharity = 0;
    uint public maxTotalTax = 20;
    
    constructor () public {
        //set the lepracoin contract address
        lep = Lepracoin(lepAddress);
        cycleProposalLength = 1 * 1 weeks;
        newCycleProposalLength = 1 * 1 weeks;
        minCharity = 1;
        addInitialCycles();
        createNewProposal();
    }
    
    function setLepAddress(address _add) external onlyOwner() {
        lepAddress = _add;
    }
    
    function addInitialCycles() private returns (bool) {
        //add original 3 cycles on deployment
        Cycle memory growth = Cycle({
            id: 0,
            name: "Growth",
            description: "The growth cycle prioritises liquidity generation to establish a solid baseline for future growth.",
            active: true,
            taxFee: 3,
            liquidityFee: 4,
            charityFee: 1,
            votes: 0
        });
        
        Cycle memory rewards = Cycle({
            id: 1,
            name: "Rewards",
            description: "The rewards cycle with utilise the growth achieved in the previous cycles to offer holders huge rewards.",
            active: true,
            taxFee: 6,
            liquidityFee: 1,
            charityFee: 1,
            votes: 0
        });
        
        Cycle memory charity = Cycle({
            id: 2,
            name: "Charity",
            description: "This cycle is where we give back and share our growth with those who need it most.",
            active: true,
            taxFee: 2,
            liquidityFee: 1,
            charityFee: 5,
            votes: 0
        });

        //add the tokenomics hash to ensure future proposals are not duplicates
        uniqueProposal[keccak256(abi.encodePacked(growth.taxFee, growth.liquidityFee, growth.charityFee))] = true;
        uniqueProposal[keccak256(abi.encodePacked(rewards.taxFee, rewards.liquidityFee, rewards.charityFee))] = true;
        uniqueProposal[keccak256(abi.encodePacked(charity.taxFee, charity.liquidityFee, charity.charityFee))] = true;
        highestCycleId = 2;
        allCycles.push(growth);
        allCycles.push(rewards);
        allCycles.push(charity);
    }
    
    function voteCycle(uint _cycle) public returns(bool success) {
        uint256 bal = lepraBalanceOf(msg.sender);
        require(bal > minLepForCycleVoting, "Address does not hold enough tokens to vote");
        require(_cycle != activeCycle, "Cannot vote for current cycle");
        CycleChangeProposal storage currentVote = cycleProposals[currentCycleProposal];
        require(currentVote.voted[msg.sender] == false, "Address already voted");
        
        uint8 votingPower = getVotingPower(msg.sender);
        //track total votes
        currentVote.totalVotes += votingPower;
        
        //map this address as having voted
        currentVote.voted[msg.sender] = true;
        
        uint _index;
        //get cycle index by id
        for(uint i=0; i<currentVote.votingCycles.length; i++){
            if (currentVote.votingCycles[i].id == _cycle){
                _index = i;
                break;
            }
        }
        
        //add the vote to the cycle
        currentVote.cycleVotedFor[msg.sender] = _cycle;
        //increase the number of votes for this cycle
        currentVote.votingCycles[_index].votes += votingPower;

        //track cycle with most votes
        if(currentVote.winningCycleVotes.length == 0){
            currentVote.winningCycleVotes.push(currentVote.votingCycles[_index].votes);
            currentVote.winningCycleId.push(_cycle);
        }
        else{
            //do nothing if less than the winning votes
            if(currentVote.votingCycles[_index].votes < currentVote.winningCycleVotes[0]){ 
        
            }else if(currentVote.votingCycles[_index].votes > currentVote.winningCycleVotes[0]){ //make this the new winner if it has more than the winning votes
                delete currentVote.winningCycleVotes; // This should reset the length to zero
                delete currentVote.winningCycleId;
                
                currentVote.winningCycleVotes.push(currentVote.votingCycles[_index].votes);
                currentVote.winningCycleId.push(_cycle);
            }else{ //tiebreaker, this cycle votes tie with the winning votes, just push it onto the end without wiping the array
                currentVote.winningCycleVotes.push(currentVote.votingCycles[_index].votes);
                currentVote.winningCycleId.push(_cycle);
            }
        }
        
        emit VoteCycle(currentCycleProposal, _cycle, msg.sender);
        return true;
    }
    
    function getVote() public view returns(uint) {
        CycleChangeProposal storage currentVote = cycleProposals[currentCycleProposal];
        require(currentVote.voted[msg.sender] == true, "Address did not vote yet");
        
        return currentVote.cycleVotedFor[msg.sender];
    }
    
    function getCycleProposal(uint id) public view returns (Cycle[] memory, uint256, uint256, uint, bool, uint[] memory, uint[] memory){
        return (
            cycleProposals[id].votingCycles, 
            cycleProposals[id].createdOn, 
            cycleProposals[id].votingDeadline, 
            cycleProposals[id].totalVotes, 
            cycleProposals[id].open,
            cycleProposals[id].winningCycleVotes,
            cycleProposals[id].winningCycleId
        );
    }
    
    function getCycleProposal() public view returns (Cycle[] memory, uint256, uint256, uint, bool, uint[] memory, uint[] memory){
        uint id = currentCycleProposal;
        return (
            cycleProposals[id].votingCycles, 
            cycleProposals[id].createdOn, 
            cycleProposals[id].votingDeadline, 
            cycleProposals[id].totalVotes, 
            cycleProposals[id].open,
            cycleProposals[id].winningCycleVotes,
            cycleProposals[id].winningCycleId
        );
    }
    
    function getActiveCycle() public view returns (Cycle memory){
        uint _index;
        //get cycle index by id
        for(uint i=0; i<allCycles.length; i++){
            if (allCycles[i].id == activeCycle){
                _index = i;
                break;
            }
        }
        return allCycles[_index];
    }
    
    function setMinVotingAmount(uint _amount) external onlyOwner() {
        minLepForCycleVoting = _amount;
    }
    
    function setMaxCyclesAmount(uint _amount) external onlyOwner() {
        maxCycles = _amount;
    }
    
    function addCycle(string memory _name, string memory _description, uint256 _taxFee, uint256 _LiquidityFee, uint256 _charityFee) external onlyOwner() returns (uint _cycleID) {
        
        highestCycleId = highestCycleId + 1;
        _cycleID = highestCycleId;
        
        Cycle memory c = Cycle({
            id: _cycleID,
            name: _name,
            description: _description,
            active: true,
            taxFee: _taxFee,
            liquidityFee: _LiquidityFee,
            charityFee: _charityFee,
            votes: 0
        });

        allCycles.push(c);
    }
    
    function deactivateCycle(uint _index) external onlyOwner() returns (bool) {
        allCycles[_index].active = false;
    }
    
    function activateCycle(uint _index) external onlyOwner() returns (bool) {
        allCycles[_index].active = true;
    }
    
    function getWinningCycle() private returns (Cycle memory){
        CycleChangeProposal storage proposal = cycleProposals[currentCycleProposal];
        
        uint _winningCycleId;
        
        //if there is more than one winner, pick a pseudo-random number to solve any potential tiebreakers
        if (proposal.winningCycleId.length > 1){
            _winningCycleId = proposal.winningCycleId[pseudoRandom(0,proposal.winningCycleId.length-1)];
        }else{
            if (proposal.winningCycleVotes.length == 0){ // no one voted, pick a random one
                _winningCycleId = proposal.votingCycles[pseudoRandom(0,proposal.votingCycles.length-1)].id;
            }else{ //only 1 winner
                _winningCycleId = proposal.winningCycleId[0];
            }
        }
        
        //get the cycle by id and return it
        for(uint i=0; i<proposal.votingCycles.length; i++){
            if (proposal.votingCycles[i].id == _winningCycleId){
                return proposal.votingCycles[i];
            }
        }
        
        //this should never be hit, be just return the zero index in case
        return proposal.votingCycles[0];
    }
    
    function switchCycle() external returns (uint _cycleID) {
        CycleChangeProposal storage current = cycleProposals[currentCycleProposal];
        
        require(current.open == true, "No active proposal");
        require(now >= current.votingDeadline, "Proposal still active");
        
        //close the proposal
        current.open = false;
        
        //get the id of the cycle with the most votes
        Cycle memory winningCycle = getWinningCycle();
        
        
        //set tax fees according to winning cycle
        lepraSetTaxFeePercent(winningCycle.taxFee);
        lepraSetCharityFeePercent(winningCycle.charityFee);
        lepraSetLiquidityFeePercent(winningCycle.liquidityFee);
        
        //set the winning cycle to be the active cycle id
        activeCycle = winningCycle.id;
        
        //create the next proposal
        createNewProposal();
        
        emit SwitchCycle(winningCycle.id);
        
        return winningCycle.id;
    }
    
    function createNewProposal() private returns (bool){
        //@dev this is adding to the current proposal, not creating a new one
        
        //create new proposal for next week of voting
        currentCycleProposal = currentCycleProposal+1;
        CycleChangeProposal storage next = cycleProposals[currentCycleProposal];
        
        //populate the active cycles to new proposal
        for(uint q=0; q < allCycles.length; q++) {
            if (allCycles[q].active == true ){
                //push the cycle into this proposal
                next.votingCycles.push(allCycles[q]);
                //reset the votes for the cycle
                next.votingCycles[next.votingCycles.length-1].votes = 0;
            }        
        }
         
        next.createdOn = now;
        next.votingDeadline = next.createdOn + cycleProposalLength;
        next.totalVotes = 0;
        next.open = true;
        
        return true;
    }
    
    function setProposalLength(uint multiplier, uint unit) external onlyOwner() returns(bool){
        if (unit == 1){
            cycleProposalLength = multiplier * 1 seconds;
        }else if (unit == 2){
            cycleProposalLength = multiplier * 1 minutes;
        }else if (unit == 3){
            cycleProposalLength = multiplier * 1 hours;
        }else if (unit == 4){
            cycleProposalLength = multiplier * 1 days;
        }else if (unit == 5){
            cycleProposalLength = multiplier * 1 weeks;
        }
        
        CycleChangeProposal storage next = cycleProposals[currentCycleProposal];
        next.votingDeadline = next.createdOn + cycleProposalLength;
        
        return true;
    }
    
    ////////New cycle proposal voting
    function setMinTax(uint256 _fee) external onlyOwner() returns(bool){
        minTax = _fee;
        return true;
    }
    
    function setMinLiquidity(uint256 _fee) external onlyOwner() returns(bool){
        minLiquidity = _fee;
        return true;
    }
    
    function setMinCharity(uint256 _fee) external onlyOwner() returns(bool){
        minCharity = _fee;
        return true;
    }
    
    function getMinProposalFees() public view returns(uint,uint,uint) {
        return (minTax, minLiquidity, minCharity);
    }
    
    function getNewProposalVote(uint _cycle) public view returns(bool, bool) {
        NewCycleProposal storage p = newCycleProposals[_cycle];
        require(p.votedYes[msg.sender] == true || p.votedNo[msg.sender] == true, "Address did not vote yet");
        
        return (p.votedYes[msg.sender], p.votedNo[msg.sender]);
    }
    
    function getNewProposalVote() public view returns(bool, bool) {
        NewCycleProposal storage p = newCycleProposals[newCycleProposal];
        require(p.votedYes[msg.sender] == true || p.votedNo[msg.sender] == true, "Address did not vote yet");
        
        return (p.votedYes[msg.sender], p.votedNo[msg.sender]);
    }
    
    function getNewCycleProposal(uint _cycle) external view returns(Cycle memory, address, uint256, uint256, uint, bool, uint, uint, bool, bool, uint) {
        NewCycleProposal storage p = newCycleProposals[_cycle];
        return (p.cycle, p.createdBy, p.createdOn, p.votingDeadline, p.totalVotes, p.open, p.yea, p.nay, p.votedYes[msg.sender], p.votedNo[msg.sender], p.id);
    }
    
    function getNewCycleProposal() external view returns(Cycle memory, address, uint256, uint256, uint, bool, uint, uint, bool, bool, uint) {
        NewCycleProposal storage p = newCycleProposals[newCycleProposal];
        return (p.cycle, p.createdBy, p.createdOn, p.votingDeadline, p.totalVotes, p.open, p.yea, p.nay, p.votedYes[msg.sender], p.votedNo[msg.sender], p.id);
    }
    
    function proposeNewCycle(string memory _name, string memory _description, uint256 _taxFee, uint256 _LiquidityFee, uint256 _charityFee) external returns (uint) {
        //@dev this is creating a new cycle, not adding one to the current cycle votes
        //check min amounts
        require(_taxFee >= minTax, "Minimum tax not met");
        require(_LiquidityFee >= minLiquidity, "Minimum liquidity not met");
        require(_charityFee >= minCharity, "Minimum charity not met");
        require(_taxFee+_LiquidityFee+_charityFee+1 <= maxTotalTax, "Proposal maximum tax amount exceeded");
        
        //check min balance
        uint256 bal = lepraBalanceOf(msg.sender);
        require(bal >= minLepForNewCycleProposal, "Address does not hold enough tokens to propose a new cycle");
        
        //check tokenomics are unique
        require(uniqueProposal[keccak256(abi.encodePacked(_taxFee, _LiquidityFee, _charityFee))] == false, "These tokenomics have already been added in a previously proposed cycle");
        
        //check thi wallet has no other activer proposal
        require(addressHasActiveProposal[msg.sender] == false, "This address already has an active Proposal");
        
        
        //create new proposal
        newCycleProposal = newCycleProposal+1;
        NewCycleProposal storage p = newCycleProposals[newCycleProposal];
        p.cycle = Cycle({
                id: 0,
                name: _name,
                description: _description,
                active: false,
                taxFee: _taxFee,
                liquidityFee: _LiquidityFee,
                charityFee: _charityFee,
                votes: 0
            });
        p.id = newCycleProposal;
        p.createdBy = msg.sender;
        p.createdOn = now;
        p.votingDeadline = p.createdOn + newCycleProposalLength;
        p.totalVotes = 0;
        p.proposalHash = keccak256(abi.encodePacked(_taxFee, _LiquidityFee, _charityFee));
        p.open = true;

        ProposalAdded(
            newCycleProposal,
            _name,
            _description,
            _taxFee,
            _LiquidityFee,
            _charityFee
        );
        
        addressHasActiveProposal[msg.sender] = true;
        
        emit ProposeNewCycle(newCycleProposal);
        
        return newCycleProposal;
    }
    
    function isProposalUnique(uint256 _taxFee, uint256 _LiquidityFee, uint256 _charityFee) external view returns(bool) {
        return uniqueProposal[keccak256(abi.encodePacked(_taxFee, _LiquidityFee, _charityFee))];
    }
    
    function executeCycleProposal(uint _cycle) external returns(bool, uint) {
        uint256 bal = lepraBalanceOf(msg.sender);
        NewCycleProposal storage p = newCycleProposals[_cycle];
        
        require(p.open == true, "No active proposal found");
        require(now >= p.votingDeadline, "Proposal still active");
        require(bal > minLepForCycleVoting, "Address does not hold enough tokens to execute proposal");
        
        //close the proposal
        p.open = false;
        addressHasActiveProposal[p.createdBy] = false;
        
        //vote passes, create and add cycle
        if (p.yea > p.nay && p.totalVotes >= votesNeededForValidProposal){
            highestCycleId = highestCycleId + 1;
            Cycle memory c = Cycle({
                id: highestCycleId,
                name: p.cycle.name,
                description: p.cycle.description,
                active: true,
                taxFee: p.cycle.taxFee,
                liquidityFee: p.cycle.liquidityFee,
                charityFee: p.cycle.charityFee,
                votes: 0
            });
            uniqueProposal[keccak256(abi.encodePacked(p.cycle.taxFee, p.cycle.liquidityFee, p.cycle.charityFee))] = true;
            (bool capHit, uint indexToInsert) = checkMaxCycleCap();
            if (capHit == true){
                allCycles[indexToInsert] = c;
            }else{
                allCycles.push(c);
            }
            
            p.cycle.active = true;
            emit ExecuteCycleProposal(_cycle, c.id, true);
            return (true, c.id);
        //vote fails
        }else{
            uniqueProposal[keccak256(abi.encodePacked(p.cycle.taxFee, p.cycle.liquidityFee, p.cycle.charityFee))] = false;
            emit ExecuteCycleProposal(_cycle, 0, false);
            return (false, 0);
        }
    }
    
    function checkMaxCycleCap() private returns(bool, uint){
        //if the numbers of cycles is euqal or over the max
        if (allCycles.length >= maxCycles){
            //remove one of the cycles with the least votes (that's not the active cycle)
            CycleChangeProposal memory currentVote = cycleProposals[currentCycleProposal];
            uint lowestIndex;
        
            //loop through all votingCycles, track the index of the cycle with the least votes
            //(proposal.votingCycles is the cycles last proposal, proposal.cycleVotes is the amount of votes each cycle received)
            for(uint i=0; i < currentVote.votingCycles.length; i++) {
                if(currentVote.votingCycles[i].id != activeCycle){
                    if (currentVote.votingCycles[i].votes < currentVote.votingCycles[lowestIndex].votes){
                        lowestIndex = i;
                    }else if (currentVote.votingCycles[i].votes == currentVote.votingCycles[lowestIndex].votes){
                        //add some random in case of tiebreaker
                        //pseudo ranom is ok here as it's of no benefit to anyone to try hack
                        if (pseudoRandom(0,1) == 0){
                            lowestIndex = i;
                        }
                    }     
                } 
            }
            
            //remove the cycle from allcycles
            uint indexToDelete;
            for(uint i=0; i < currentVote.votingCycles.length; i++) {
                if (allCycles[i].id == currentVote.votingCycles[lowestIndex].id){
                    indexToDelete = i;
                    break;
                }
            }
            
            //remove the cyle from the current vote
            cycleProposals[currentCycleProposal].votingCycles[lowestIndex] = cycleProposals[currentCycleProposal].votingCycles[cycleProposals[currentCycleProposal].votingCycles.length-1];
            cycleProposals[currentCycleProposal].votingCycles.pop();
            
            return (true, indexToDelete);
        }
        return (false, 0);
    }
    
    function voteCycleProposal(uint _cycle, bool vote) public returns(bool success) {
        uint256 bal = lepraBalanceOf(msg.sender);
        require(bal > minLepForCycleVoting, "Address does not hold enough tokens to vote");
        require(newCycleProposals[_cycle].open == true, "Voting is closed for this cycle");
        NewCycleProposal storage p = newCycleProposals[_cycle];
        require(now < p.votingDeadline, "Voting deadline passed");
        require(p.votedYes[msg.sender] == false && p.votedNo[msg.sender] == false, "Address already voted");
        
        uint8 votingPower = getVotingPower(msg.sender);
        
        //track total votes
        p.totalVotes += votingPower;
        
        emit VoteCycleProposal(_cycle, msg.sender, vote);
        
        //record the vote
        if (vote == true){
            p.yea = p.yea+votingPower;
            p.votedYes[msg.sender] = true;
        }else{
            p.nay = p.nay+votingPower;
            p.votedNo[msg.sender] = true;
        }
        return true;
    }
    
    function setNewCycleProposalLength(uint multiplier, uint unit) external onlyOwner() returns(bool){
        if (unit == 1){
            newCycleProposalLength = multiplier * 1 seconds;
        }else if (unit == 2){
            newCycleProposalLength = multiplier * 1 minutes;
        }else if (unit == 3){
            newCycleProposalLength = multiplier * 1 hours;
        }else if (unit == 4){
            newCycleProposalLength = multiplier * 1 days;
        }else if (unit == 5){
            newCycleProposalLength = multiplier * 1 weeks;
        }
        
        NewCycleProposal storage p = newCycleProposals[newCycleProposal];
        p.votingDeadline = p.createdOn + newCycleProposalLength;
        
        return true;
    }
    
    function setVotesNeededForValidProposal(uint _amt) external onlyOwner() returns(bool){
        votesNeededForValidProposal = _amt;
        return true;
    }
    
    function setMaxTotalTax(uint _amt) external onlyOwner() returns(bool){
        maxTotalTax = _amt;
        return true;
    }
    
    
    function getVotingPower(address _add) public view returns(uint8){
        uint256 bal = lepraBalanceOf(_add);
        if (bal < minLepForCycleVoting){
            return 0;
        }else if (bal >= minLepForCycleVoting && bal < minLepForCycleVoting * 5){
            return 1;
        }else if (bal >= minLepForCycleVoting * 5 && bal < minLepForCycleVoting * 16){
            return 2;
        }else if (bal >= minLepForCycleVoting * 16 && bal < minLepForCycleVoting * 32){
            return 3;
        }else if (bal >= minLepForCycleVoting * 32 && bal < minLepForCycleVoting * 64){
            return 4;
        }else{
            return 5;
        }
    }
    
    ///////library
    function pseudoRandom(uint from, uint to) internal returns (uint) {
        uint randomnumber = uint(keccak256(abi.encodePacked(now, msg.sender, randomNonce))) % to;
        randomnumber = randomnumber + from;
        randomNonce++;
        return randomnumber;
    }
    
    
    ///////Events
    event SwitchCycle(
        uint _winningProposalId
    );
    
    event ProposeNewCycle(
        uint _proposalId
    );
    
    event ExecuteCycleProposal(
        uint _proposalId,
        uint _cycleId,
        bool _passed
    );
    
    event VoteCycle(
        uint _cycleProposalId, 
        uint _cycle,
        address _sender
    );
    
    event VoteCycleProposal(
        uint _cycleProposalId,
        address _sender,
        bool _vote
    );
}