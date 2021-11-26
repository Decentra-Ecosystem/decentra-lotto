pragma solidity ^0.6.12;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MockDelo is ERC20 {
  constructor() ERC20("DELO", "DELO") public {
    _mint(msg.sender, 82000 * 10**6 * 10**18);
  }
}