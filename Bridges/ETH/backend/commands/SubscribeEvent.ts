import Env from '@ioc:Adonis/Core/Env'
import { BaseCommand } from '@adonisjs/core/build/standalone'
import addresses from 'Config/constants/contracts'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import ReserveAbi from 'Config/abi/reserve.json'

export default class SubscribeEvent extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'subscribe:event'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: true,
  }

  public async run() {
    this.logger.info('')
    const { default: Bridge } = await import('App/Models/Bridge')

    const web3Bsc = new Web3(Env.get('BSC_HOST'))
    const web3Eth = new Web3(Env.get('ETH_HOST'))

    const { address: adminBsc } = web3Bsc.eth.accounts.wallet.add(Env.get('PRIVATE_KEY'));
    const { address: adminEth } = web3Eth.eth.accounts.wallet.add(Env.get('PRIVATE_KEY'));

    const reserveContractOnBsc = new web3Bsc.eth.Contract((ReserveAbi as unknown) as AbiItem, addresses.bsc)
    const reserveContractOnEth = new web3Eth.eth.Contract((ReserveAbi as unknown) as AbiItem, addresses.eth)

    const bridge = await Bridge.find(1)
    const lastBlock = bridge.lastBlock

    reserveContractOnBsc.getPastEvents('Burned', {
      fromBlock: lastBlock,
      toBlock: 'latest'
    }, function (err, event) {
      console.log('event:', event)
      console.log('error:', err)
    }).then(async events => {
      for (let i = 0; i < events.length; i++) {
        const { to, amount } = events[i].returnValues

        const tx = reserveContractOnEth.methods.mint(to, amount);
        const [gasPrice, gasCost] = await Promise.all([
          web3Eth.eth.getGasPrice(),
            tx.estimateGas({from: adminEth}),
          ]);
        const data = tx.encodeABI();
        const txData = {
          from: adminEth,
          to: reserveContractOnEth.options.address,
          data,
          gas: gasCost,
          gasPrice
        };
        const transaction = await web3Eth.eth.sendTransaction(txData);
        
        console.log(`Transaction hash: ${transaction.transactionHash}`);
      }
    })

    reserveContractOnEth.events.Burned(function (err, event) {
      console.log('event:', event)
      console.log('error:', err)
    }).on('data', async event => {
      const { to, amount } = event.returnedValues
      
      const tx = reserveContractOnBsc.methods.mint(to, amount);
      const [gasPrice, gasCost] = await Promise.all([
        web3Bsc.eth.getGasPrice(),
          tx.estimateGas({from: adminBsc}),
        ]);
      const data = tx.encodeABI();
      const txData = {
        from: adminBsc,
        to: reserveContractOnBsc.options.address,
        data,
        gas: gasCost,
        gasPrice
      };
      const transaction = await web3Bsc.eth.sendTransaction(txData);

      console.log(`Transaction hash: ${transaction.transactionHash}`);
    })

  }
}
