const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentraLotto", function () {
  it("Should return the new greeting once it's changed", async function () {
    const DecentraLotto = await ethers.getContractFactory("DecentraLotto");
    const decentraLotto = await DecentraLotto.deploy("Hello, world!");
    await decentraLotto.deployed();

    expect(await decentraLotto.greet()).to.equal("Hello, world!");

    const setGreetingTx = await decentraLotto.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await decentraLotto.greet()).to.equal("Hola, mundo!");
  });
});
