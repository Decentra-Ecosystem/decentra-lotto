import Env from '@ioc:Adonis/Core/Env'
import { BaseCommand } from '@adonisjs/core/build/standalone'
import addresses from 'Config/constants/contracts'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import ReserveAbi from 'Config/abi/reserve.json'

enum BridgeStatus {
  CREATED,
  PENDING,
  PROCESSED
}
export default class SubscribeEventOnEth extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'subscribe:event:eth'

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
    const { default: TaskBsc } = await import('App/Models/TaskBsc')
    const { default: EthBlock } = await import('App/Models/EthBlock')

    const deployedBlock = Env.get('ETH_START_BLOCK');

    const web3Bsc = new Web3(Env.get('BSC_HOST'))
    const web3Eth = new Web3(Env.get('ETH_HOST'))

    const { address: adminBsc } = web3Bsc.eth.accounts.wallet.add(Env.get('PRIVATE_KEY'));
    const { address: adminEth } = web3Eth.eth.accounts.wallet.add(Env.get('PRIVATE_KEY'));

    const reserveContractOnBsc = new web3Bsc.eth.Contract((ReserveAbi as unknown) as AbiItem, addresses.bsc)
    const reserveContractOnEth = new web3Eth.eth.Contract((ReserveAbi as unknown) as AbiItem, addresses.eth)

    const block = await EthBlock.first()
    if (!block) {
      await EthBlock.create({
        blockNumber: deployedBlock
      })
    }

    while(true) {
      try {
        const block = await EthBlock.first()
        const currentBlock = await web3Eth.eth.getBlockNumber()
        const fromBlock = block?.blockNumber ? block?.blockNumber : deployedBlock
        const toBlock = fromBlock + 10 < currentBlock ? fromBlock + 10 : currentBlock
        
        reserveContractOnEth.getPastEvents('Burned', {
          fromBlock: fromBlock,
          toBlock: toBlock
        }, function (err, event) {
          // console.log('event:', event)
          // console.log('error:', err)
        }).then(async events => {
          console.log(`parsing events from block ${fromBlock} to block ${toBlock} ...`)
          for (let i = 0; i < events.length; i++) {
            const { from, amount } = events[i].returnValues
    
            // save to database
            await TaskBsc.firstOrCreate({
              txHash: events[i].transactionHash
            }, {
              txHash: events[i].transactionHash,
              to: from,
              amount,
              status: BridgeStatus.CREATED,
              blockNumber: events[i].blockNumber
            })

            // update blockNumber
            block!.blockNumber = events[i].blockNumber
            block?.save()
          }

          block!.blockNumber = toBlock
          block?.save()
    
          const tasks = await TaskBsc.query().where('status', BridgeStatus.CREATED)
          for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i]
            const tx = reserveContractOnBsc.methods.mint(task.to, task.amount, task.id);
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
            web3Bsc.eth.sendTransaction(txData)
              .on('sent', async function() {
                task.status = BridgeStatus.PENDING
                await task.save()
              })
              .on('receipt', async function(receipt) {
                console.log(`Transaction hash: ${receipt.transactionHash}`)
                task.status = BridgeStatus.PROCESSED
                await task.save()
              })
            
            await new Promise(resolve => setTimeout(resolve, 1 * 1000));    // delay 1s
          }
    
        })
  
        await new Promise(resolve => setTimeout(resolve, 10 * 1000));    // delay 10s
      } catch (err) {
        console.log(err)
      }
    }
  }
}
