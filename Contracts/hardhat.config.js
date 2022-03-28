require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');
let secrets = require("./secrets");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      }
    ]
  },
  networks: {
    bscTestNet:{
      url: secrets.urlBSCTestNet,
      accounts: [secrets.deployerPrivatekeyTest]
    },
    bscMainNet:{
      url: secrets.urlBSCMainNet,
      accounts: [secrets.deloDevLive]
    },
    ethMainNetTest:{
      url: secrets.urlETHMainNet,
      accounts: [secrets.deployerPrivatekeyTest]
    },
    bscMainNetTest:{
      url: secrets.urlBSCMainNet,
      accounts: [secrets.deployerPrivatekeyTest]
    },
    ethRinkeby:{
      url: secrets.urlETHRinkeby,
      accounts: [secrets.deployerPrivatekeyTest]
    },
    ethRopsten:{
      url: secrets.urlETHRopsten,
      accounts: [secrets.deployerPrivatekeyTest],
    },
    ethKovan:{
      url: secrets.urlETHKovan,
      accounts: [secrets.deployerPrivatekeyTest],
    },
    ethGorli:{
      url: secrets.urlETHGorli,
      accounts: [secrets.deployerPrivatekeyTest],
    },
    ethMainNet:{
      url: secrets.urlETHMainNet,
      accounts: [secrets.deployerPrivatekeyLive]
    }
  },
  etherscan: {
    apiKey: secrets.etherscan
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  mocha: {
    timeout: 400000
  }
};
