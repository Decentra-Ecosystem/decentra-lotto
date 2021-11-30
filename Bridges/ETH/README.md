# DecentraLottoETHBridge

This is the repo for the Decentra-Lotto Ethereum bridge

Bridge consists of two modules: Backend and Smart contract

## Smart Contract

The functionality of smart contract (Reserve.sol) is to support token bridge on ethereum and bsc network.

Smart contract is deployed on two network (ethereum and bsc).

When user transfer token from one network to other network, user calls `burn` function of Reserve contract.

Then Reserve contract receive tokens from the user and stores them on a pool.

And in other network, Reserve contract transfers (`mint` function) the same amount of ethereum tokens to the same address(user).

So it looks like user transferred tokens from one network to other network.

In this logic, Reserve contract of other network calls `mint` function so it costs gas fee.

We need to compensate this gas fee so we set the gasCost in Reserve contract so for user to use bridge, user should pay gas fee of other network as well as the same network gas fee. For example, when user transfer token from bsc to ethereum, user should gas for ethereum `mint` in forms of bnb.
i.e. bnb amount equal to eth gas fee of `mint`

Gas cost of Reserve contract can be set only by owner.

And we have a 50% of total supply of token in a reserve in ethereum to support ethereum token liquidity at first.

So at first, we have 41,000,000,000 tokens in ethereum bridge pool.

And limited the bridgeable token amount to 41,000,000,000.

So currently, total supply of token on bsc is 82,000,000,000 and reserve pool has no tokens on bsc.

And ethereum reserve pool has 41,000,000,000 tokens and other 41,000,000,000 is circulating supply.

When user transfer tokens from bsc to ethereum, bsc reserve pool increases and ethereum reserve pool decreases.

## Backend

The main functionality of backend is to receive the event of token `burn` of Reserve contract and emit the `mint` of Reserve contract in other network.

So backend has two subscription module, one for bsc and one for ethereum.

Each one listens the `Burned` event from one network and triggers `mint` call of other network.


## Deployment

1. Deploy Reserve contract on two networks
  
  construct param: address of token

2. Call `initialize` function to initialize the bridge contract.

  - BSC

    We just need to call `initialize` function.

  - Ethereum

    We should transfer 41,000,000,000 amount of ethereum tokens to Reserve contract at first.

    Secondly, call `initialize` function.

3. Call `setGasCost` of Reserve contract.

  - BSC

    We need to calculate bnb amount equal to the current Etheureum gas fee of token and should set that amount.
    For example, supposing curent gas fee of etheruem is 0.01 ether then we we should set gasCost of BSC Reserve contract to 0.01 * ether price / bnb price

  - Ethereum

    vice versa
