// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Reserve is Ownable {

  using SafeERC20 for IERC20;
  using SafeMath for uint256;

  IERC20 public token;

  uint256 private reserve;
  bool private initialized = false;

  event Minted(address token, uint256 amount);
  event Burned(address token, uint256 amount);
  
  constructor(IERC20 _token) public {
    token = _token;
  }

  function initialize() external onlyOwner {
    require(initialized == false, "already initialized");
    reserve = token.balanceOf(address(this));
    initialized = true;
  }

  function mint(uint256 _amount) external onlyOwner {
    require(_amount != 0, "amount is zero");
    require(reserve >= _amount, "amount can't be bigger than reserve");
    token.safeTransfer(msg.sender, _amount);
    reserve = reserve.sub(_amount);
    emit Minted(address(token), _amount);
  }

  function burn(uint256 _amount) external {
    require(_amount != 0, "amount is zero");
    token.safeTransferFrom(msg.sender, address(this), _amount);
    reserve = reserve.add(_amount);
    emit Burned(address(token), _amount);
  }

  function withdrawFreeToken(uint256 _amount) external onlyOwner {
    uint256 bal = token.balanceOf(address(this));
    uint256 free = bal.sub(reserve);
    require(free > 0, "No available token to withdraw");
    token.safeTransfer(msg.sender, _amount);
  }

}