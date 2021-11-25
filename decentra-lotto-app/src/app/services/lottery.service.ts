import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {
    IS_LIVE,
    LOTTO_CONTRACT_ADDRESS_TEST_NET, 
    LOTTO_CONTRACT_ADDRESS_MAIN_NET,
    OLD_LOTTO_CONTRACT_ADDRESS_MAIN_NET,
    DELO_CONTRACT_ADDRESS_MAIN_NET,
    DELO_CONTRACT_ADDRESS_TEST_NET,
    TOKEN_DECIMALS, 
    BNB_DECIMALS,
    DELOSTAKING_CONTRACT_ADDRESS_MAIN_NET,
    DELOSTAKING_CONTRACT_ADDRESS_TEST_NET,
    WEB3
} from '../models/meta-mask.dictionary';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import DecentraLotto from "../../assets/json/DecentraLotto.json";
import Delo from "../../assets/json/delo.json";
import DELOStaking from "../../assets/json/delo_stake.json"
import Approve from "../../assets/json/approve.json";
import { StakingStats } from '../models/stakingstats.model';

@Injectable({
    providedIn: 'root'
})
export class LotteryService {
    web3js: any;
    provider: any;
    accounts: any;
    LOTTO_CONTRACT_ADDRESS: string;
    DELO_CONTRACT_ADDRESS: string;
    DELOSTAKING_CONTRACT_ADDRESS: string;
    lottoContract: any;
    stakingContract: any;
    deloContract: any;
    options: any;
    web3Modal: any;
    ethereumDetected: boolean = false;

    private accountStatusSource = new Subject<any>();
    accountStatus$ = this.accountStatusSource.asObservable();

    constructor() {
        const optionsLive = {
            rpc: {
                56: 'https://bsc-dataseed.binance.org/' //https://red-spring-violet.bsc.quiknode.pro/' //https://bsc-dataseed.binance.org/ //https://bsc-dataseed1.defibit.io/
            },
            network: 'Binance Smart Chain',
            chainId: 56,
            infuraId: '',
        }
        const optionsTest = {
            rpc: {
                56: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
            },
            network: 'Smart Chain - Testnet',
            chainId: 97,
            infuraId: '',
        }
        
        if (IS_LIVE == true){
            this.options = optionsLive;
            this.LOTTO_CONTRACT_ADDRESS = LOTTO_CONTRACT_ADDRESS_MAIN_NET;
            this.DELO_CONTRACT_ADDRESS = DELO_CONTRACT_ADDRESS_MAIN_NET;
            this.DELOSTAKING_CONTRACT_ADDRESS = DELOSTAKING_CONTRACT_ADDRESS_MAIN_NET;
        }else{
            this.options = optionsTest;
            this.LOTTO_CONTRACT_ADDRESS = LOTTO_CONTRACT_ADDRESS_TEST_NET;
            this.DELO_CONTRACT_ADDRESS = DELO_CONTRACT_ADDRESS_TEST_NET;
            this.DELOSTAKING_CONTRACT_ADDRESS = DELOSTAKING_CONTRACT_ADDRESS_TEST_NET;
        }

        this.web3Modal = new Web3Modal({
            network: "binance",
            cacheProvider: true,
            providerOptions: {
                walletconnect: {
                  package: WalletConnectProvider,
                  options: this.options
                }
            },
            theme: {
                background: "rgb(39, 49, 56)",
                main: "rgb(199, 199, 199)",
                secondary: "rgb(136, 136, 136)",
                border: "rgba(195, 195, 195, 0.14)",
                hover: "rgb(16, 26, 32)"
              }
        });
    }

    async clearCache(){
        await this.web3Modal.clearCachedProvider();
    }

    async disconnect(){
        console.log("Killing the wallet connection", this.provider);
        await this.web3Modal.clearCachedProvider();
        this.provider = null;
        this.clearCache();
        window.location.reload();
    }

    async getChain(){
        return await this.web3js.eth.net.getId();
    }

    requestChain(){
        window.ethereum
        .request(
            { method: 'wallet_addEthereumChain', 
                params: [
                    { 
                        chainId: '0x' + this.options.chainId.toString(16), 
                        chainName: this.options.network, 
                        nativeCurrency: { 
                            name: 'BNB', 
                            symbol: 'BNB', 
                            decimals: BNB_DECIMALS 
                        }, 
                        rpcUrls: [this.options.rpc[56]], 
                        blockExplorerUrls: ['https://bscscan.com/'] 
                    }
                ] 
        })
        .catch((err) => {
            if (err.code === 4001) {
              // EIP-1193 userRejectedRequest error
              // If this happens, the user rejected the connection request.
              console.log('Please connect to MetaMask.');
            } else {
              console.error(err);
            }
        });
    }

    handleEthereum() {
        const { ethereum } = window;
        if (ethereum && ethereum.isMetaMask) {
            // Access the decentralized web!
            this.ethereumDetected = true;
        } else {
            console.log('Please install MetaMask!');
        }
    }

    detectEthereumProvider({ mustBeMetaMask = false, silent = false, timeout = 3000, } = {}) {
        _validateInputs();
        let handled = false;
        return new Promise((resolve) => {
            if (window.ethereum) {
                handleEthereum();
            }
            else {
                window.addEventListener('ethereum#initialized', handleEthereum, { once: true });
                setTimeout(() => {
                    handleEthereum();
                }, timeout);
            }
            function handleEthereum() {
                if (handled) {
                    return;
                }
                handled = true;
                window.removeEventListener('ethereum#initialized', handleEthereum);
                const { ethereum } = window;
                if (ethereum && (!mustBeMetaMask || ethereum.isMetaMask)) {
                    resolve(ethereum);
                }
                else {
                    const message = mustBeMetaMask && ethereum
                        ? 'Non-MetaMask window.ethereum detected.'
                        : 'Unable to detect window.ethereum.';
                    !silent && console.error('@metamask/detect-provider:', message);
                    resolve(null);
                }
            }
        });
        function _validateInputs() {
            if (typeof mustBeMetaMask !== 'boolean') {
                throw new Error(`@metamask/detect-provider: Expected option 'mustBeMetaMask' to be a boolean.`);
            }
            if (typeof silent !== 'boolean') {
                throw new Error(`@metamask/detect-provider: Expected option 'silent' to be a boolean.`);
            }
            if (typeof timeout !== 'number') {
                throw new Error(`@metamask/detect-provider: Expected option 'timeout' to be a number.`);
            }
        }
    }
    
    async connectToMetaMask() {
        const provider = await this.detectEthereumProvider();

        if (provider){
            this.ethereumDetected = true;
        }

        if (this.ethereumDetected == false){
            return false;
        }

        try {
            this.provider = await this.web3Modal.connect(); // set provider
        } catch (error) {
            return false;
        }

        this.web3js = new Web3(this.provider); // create web3 instance
        var p = await this.web3js.eth.net.getId((err: any, network: any)=> {});
        // if (p != this.options.chainId){
        //     if (document.hasFocus()) {
        //         this.requestChain();
        //     }
        // }

        this.accounts = await this.web3js.eth.getAccounts(); 
        this.accountStatusSource.next(this.accounts);

        this.lottoContract = new this.web3js.eth.Contract(DecentraLotto, this.LOTTO_CONTRACT_ADDRESS);
        this.deloContract = new this.web3js.eth.Contract(Delo, this.DELO_CONTRACT_ADDRESS);
        this.stakingContract = new this.web3js.eth.Contract(DELOStaking, this.DELOSTAKING_CONTRACT_ADDRESS);

        // detect Metamask account change
        window.ethereum.on('accountsChanged', async function (accounts: any) {
            window.location.reload();
            // const domEvent = new CustomEvent('accountsChanged', { bubbles: true });
            // document.dispatchEvent(domEvent);
        });
    
        // detect Network account change
        window.ethereum.on('chainChanged', function(networkId: any){
            window.location.reload();
        });   

        return this.accounts[0];
    }

    async getUserBalance(){
        var bal;
        try{
            bal = await this.deloContract
                .methods.balanceOf(this.accounts[0])
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return [this.roundToken(bal, 4), bal];
    }

    async getDrawStats(id: any) {
        var draw;
        try{
            if (id){
                draw = await this.lottoContract
                .methods.getDrawStats(id)
                .call();
            }else{
                draw = await this.lottoContract
                .methods.getDrawStats()
                .call();
            }
        }catch(err){
            return -1;
        }
        return draw;
    }

    async getCurrentPot(){
        var draw;
        try{
            draw = await this.lottoContract
                .methods.getCurrentPot()
                .call();
        }catch(err){
            return -1;
        }
        return draw;
    }

    async getWalletWinAmountForDraw(id: any, address: any) {
        var amt;
        try{
            amt = await this.lottoContract
                .methods.getWalletWinAmountForDraw(id, address)
                .call();
        }catch(err){
            return -1;
        }
        return [amt, this.roundToken(amt, 3)];
    }

    async getWalletWinAmountForDraw1(id: any, address: any) {
        var amt;
        try{
            var contract = new this.web3js.eth.Contract(DecentraLotto, OLD_LOTTO_CONTRACT_ADDRESS_MAIN_NET);
            amt = await contract
                .methods.getWalletWinAmountForDraw(id, address)
                .call();
        }catch(err){
            return -1;
        }
        return [amt, this.roundToken(amt, 3)];
    }

    async getWalletStats(id: any, address: any = this.accounts[0]) {
        var draw;
        try{
            if (id){
                draw = await this.lottoContract
                .methods.getDrawWalletStats(id)
                .call({ from: this.accounts[0] });
            }else{
                draw = await this.lottoContract
                .methods.getDrawWalletStats()
                .call({ from: this.accounts[0] });
            }
        }catch(err){
            return -1;
        }
        return draw;
    }

    async getBNBBalance(){
        return await this.web3js.eth.getBalance(this.accounts[0], function(err: any, result: string | import("bn.js")) {
            if (err) {
                console.log(err);
                return -1;
            } else {
                return Web3.utils.fromWei(result, "ether");
            }
        })
    }

    async getBalanceOfToken(address: any) {
        var contract = new this.web3js.eth.Contract(Approve, address);
        var success;
        try{
            success = await contract
                .methods.balanceOf(this.accounts[0])
                .call({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return success;
    }

    async getPEGValueInDelo(amt: number){
        var success;
        try{
            success = await this.lottoContract
                .methods.getPEGValueInDelo(amt)
                .call();
        }catch(err){
            return -1;
        }
        return [success[2], this.roundToken(success[2], 3)];
    }

    async getBNBValueInDelo(amt: number){
        var success;
        try{
            success = await this.lottoContract
                .methods.getBNBValueInDelo(amt)
                .call();
        }catch(err){
            return -1;
        }
        return [success[1], this.roundToken(success[1], 3)];
    }

    async getHedgeDivisor(){
        var success;
        try{
            success = await this.lottoContract
                .methods.hedgeDivisor()
                .call();
        }catch(err){
            return false;
        }
        return success;
    }

    async getNumberWinners(){ 
        var num;
        try{
            num = await this.lottoContract
                .methods.getNumberWinners()
                .call();
        }catch(err){
            return -1;
        }
        return num;
    }

    async getPriceForTicketsDecimals(token: { address: any; decimals: number; }, num: any) {
        var price;
        try{
            price = await this.lottoContract
                .methods.getPriceForTickets(token.address, num)
                .call();
        }catch(err){
            return -1;
        }
        return price/(Math.pow(10, token.decimals));
    }

    async getDiscountForTickets() {
        var one, two, three;
        try{
            one = await this.lottoContract
                .methods.discountFiveTickets()
                .call();
                two = await this.lottoContract
                .methods.discountTenTickets()
                .call();
                three = await this.lottoContract
                .methods.discountTwentyTickets()
                .call();
        }catch(err){
            return [];
        }
        return [one, two, three];
    }

    async getPriceForTicketsRaw(token: { address: any; }, num: any) {
        var price;
        try{
            price = await this.lottoContract
                .methods.getPriceForTickets(token.address, num)
                .call();
        }catch(err){
            return -1;
        }
        return price;
    }

    async buyTicketsBNB(num: any, value: any, ticketRecipient: any = null, airdropRecipient: any = null) {
        var success;
        var r = ticketRecipient != null ? ticketRecipient : this.accounts[0];
        value = this.web3js.utils.toBN(value)
        var airdrop = airdropRecipient != null ? airdropRecipient : r;
        try{
            success = await this.lottoContract
                .methods.buyTicketsBNB(num, r, airdrop)
                .send({ from: this.accounts[0], value: value });
        }catch(err){
            console.log(err)
            return false;
        }
        return success;
    }

    async buyTicketsStable(address: any, num: any, ticketRecipient: any = null, airdropRecipient: any = null) {
        var success;
        var r = ticketRecipient != null ? ticketRecipient : this.accounts[0];
        var airdrop = airdropRecipient != null ? airdropRecipient : r;
        try{
            success = await this.lottoContract
                .methods.buyTicketsStable(address, num, r, airdrop)
                .send({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return success;
    }

    async enableToken(address: any, amount: any) {
        var contract = new this.web3js.eth.Contract(Approve, address);
        amount = this.web3js.utils.toBN(amount);
        var success;
        try{
            success = await contract
                .methods.approve(this.LOTTO_CONTRACT_ADDRESS, amount)
                .send({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return success;
    }

    async enableStaking(address: any, amount: any) {
        var success;
        try{
            success = await this.deloContract
                .methods.approve(address, amount)
                .send({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return success;
    }

    async getAllowance(address: any) {
        var contract = new this.web3js.eth.Contract(Approve, address);
        var result;
        try{
            result = await contract
                .methods.allowance(this.accounts[0], this.LOTTO_CONTRACT_ADDRESS)
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return result;
    }

    async getAllowanceStaking(address: any) {
        var result;
        try{
            result = await this.deloContract
                .methods.allowance(this.accounts[0], address)
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return result;
    }

    async endDraw() {
        var success;
        try{
            success = await this.lottoContract
                .methods.endDrawAndGetRandom()
                .send({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return success;
    }

    async drawWinners() {
        var success;
        try{
            success = await this.lottoContract
                .methods.drawWinners()
                .send({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return success;
    }

    async hasRandom() {
        var r;
        try{
            r = await this.lottoContract
                .methods.randomResult()
                .call();
        }catch(err){
            return false;
        }
        return r>0;
    }

    async setDeadline() {
        var r;
        try{
            r = await this.lottoContract
                .methods.updateLengthOfCurrentDraw(1, 1)
                .send({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return r;
    }

    async stake(amount) {
        var r;
        try{
            r = await this.stakingContract
                .methods.STAKE(amount)
                .send({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return r;
    }

    async getStakedRaw() {
        var r;
        try{
            r = await this.stakingContract
                .methods.yourStakedDELO(this.accounts[0])
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return r;
    }
    
    async getPendingReward() {
        var r;
        try{
            r = await this.stakingContract
                .methods.getPendingReward(this.accounts[0])
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return r;
    }

    async withdrawPendingRewards() {
        var r;
        try{
            r = await this.stakingContract
                .methods.CLAIMREWARD()
                .send({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return r;
    }

    async withdrawStake(amount) {
        var r;
        try{
            r = await this.stakingContract
                .methods.WITHDRAW(amount)
                .send({ from: this.accounts[0] });
        }catch(err){
            return false;
        }
        return r;
    }

    async getStakingTVL() {
        var r;
        try{
            r = await this.stakingContract
                .methods.totalStakes()
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return [r,this.roundToken(r, 2)];
    }

    async getTotalDividends() {
        var r;
        try{
            r = await this.stakingContract
                .methods.totalDividends()
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return r;
    }

    async getStakingRound() {
        var r;
        try{
            r = await this.stakingContract
                .methods.round()
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return r;
    }

    async getDELOValueInPeg(amountIn){
        if (amountIn == 0 || !amountIn) return 0;
        var r;
        try{
            r = await this.lottoContract
                .methods.getDELOValueInPeg(amountIn)
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return this.roundPEG(r[2], 1);
    }

    async getTotalDonated(address) {
        var r;
        try{
            r = await this.deloContract
                .methods.balanceOf(address)
                .call({ from: this.accounts[0] });
        }catch(err){
            return -1;
        }
        return r;
    }

    public roundPEG(amt, accuracy){
        return StakingStats.round(amt, BNB_DECIMALS, accuracy);
    }

    public roundToken(amt, accuracy){
        return StakingStats.round(amt, TOKEN_DECIMALS, accuracy);
    }
}
