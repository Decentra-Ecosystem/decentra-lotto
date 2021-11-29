import Env from '@ioc:Adonis/Core/Env'
import { BaseCommand } from '@adonisjs/core/build/standalone'
import addresses from 'Config/constants/contracts'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import ReserveAbi from 'Config/abi/reserve.json'

enum BridgeStatus {
  PENDING,
  PROCESSED
}
export default class SubscribeEventOnBsc extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'subscribe:event:bsc'

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
    const { default: TaskEth } = await import('App/Models/TaskEth')

    const deployedBlock = Env.get('BSC_START_BLOCK');

    const web3Bsc = new Web3(Env.get('BSC_HOST'))
    const web3Eth = new Web3(Env.get('ETH_HOST'))

    const { address: adminBsc } = web3Bsc.eth.accounts.wallet.add(Env.get('PRIVATE_KEY'));
    const { address: adminEth } = web3Eth.eth.accounts.wallet.add(Env.get('PRIVATE_KEY'));

    const reserveContractOnBsc = new web3Bsc.eth.Contract((ReserveAbi as unknown) as AbiItem, addresses.bsc)
    const reserveContractOnEth = new web3Eth.eth.Contract((ReserveAbi as unknown) as AbiItem, addresses.eth)

    while(true) {
      try {
        const lastBlock = (await TaskEth.query().orderBy('blockNumber', 'desc').first())?.blockNumber

        reserveContractOnBsc.getPastEvents('Burned', {
          fromBlock: lastBlock ? lastBlock : deployedBlock,
          toBlock: 'latest'
        }, function (err, event) {
          // console.log('event:', event)
          // console.log('error:', err)
        }).then(async events => {
          console.log(`parsing events from block ${lastBlock ? lastBlock : deployedBlock} ...`)
          for (let i = 0; i < events.length; i++) {
            const { from, amount } = events[i].returnValues
            // save to database
            await TaskEth.firstOrCreate({
              txHash: events[i].transactionHash
            }, {
              txHash: events[i].transactionHash,
              to: from,
              amount,
              status: BridgeStatus.PENDING,
              blockNumber: events[i].blockNumber
            })
          }
    
          const tasks = await TaskEth.query().where('status', BridgeStatus.PENDING)
          for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i]
            const tx = reserveContractOnEth.methods.mint(task.to, task.amount, task.id);
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
            if (transaction.status) {
              task.status = BridgeStatus.PROCESSED
              await task.save()
            }
            
            console.log(`Transaction hash: ${transaction.transactionHash}`);
          }
    
        })
  
        await new Promise(resolve => setTimeout(resolve, 10 * 1000));    // delay 10s
      } catch (err) {
        console.log(err)
      }
    }
  }
}
