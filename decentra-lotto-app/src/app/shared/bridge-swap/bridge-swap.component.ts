import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  DELO_CONTRACT_ADDRESS_MAIN_NET, 
  DELO_CONTRACT_ADDRESS_TEST_NET, 
  DELO_BSC_BRIDGE_CONTRACT_ADDRESS_MAIN_NET,
  DELO_BSC_BRIDGE_CONTRACT_ADDRESS_TEST_NET,
  DELO_ETH_BRIDGE_CONTRACT_ADDRESS_MAIN_NET,
  DELO_ETH_BRIDGE_CONTRACT_ADDRESS_TEST_NET,
  IS_LIVE, 
  TOKEN_DECIMALS 
} from 'src/app/models/meta-mask.dictionary';
import { WalletStats } from 'src/app/models/walletstats.model';
import { LotteryService } from 'src/app/services/lottery.service';
import { PlatformCheckerService } from 'src/app/services/platform.service';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-bridge-swap',
  templateUrl: './bridge-swap.component.html',
  styleUrls: ['./bridge-swap.component.css']
})
export class BridgeSwapComponent implements OnInit, OnDestroy {

  @Input() reserve;
  balanceControl = new FormControl(0, Validators.min(0));
  receivedControl = new FormControl(0, Validators.min(0));
  user:any;
  walletStats: WalletStats;
  symbols: any;
  loading: boolean = true;
  isBSC: boolean = true;
  gasFee: any;
  approved:boolean;
  private ngUnsubscribe = new Subject();

  constructor(private lotteryService: LotteryService, private statsService: StatsService, private platform: PlatformCheckerService,) { 
    this.user = {address: '', truncatedAddress: '', balance: '0', balanceETH: '0'};
  }

  ngOnInit(): void {
    this.connect();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async connect(){
    var x = await this.lotteryService.connectToMetaMask();
    var chain = await this.lotteryService.getChain();
    if(chain == 56 || chain == 97){
      this.isBSC = true;
      this.gasFee = await this.lotteryService.getBridgeGasCost('BSC');
    }else if (chain == 1){
      this.isBSC = false;
      this.gasFee = await this.lotteryService.getBridgeGasCost('ETH');
    }

    if (IS_LIVE){
      var con = this.isBSC ? DELO_BSC_BRIDGE_CONTRACT_ADDRESS_MAIN_NET : DELO_ETH_BRIDGE_CONTRACT_ADDRESS_MAIN_NET;
      this.symbols = {
        DELO: {address: DELO_CONTRACT_ADDRESS_MAIN_NET, decimals: TOKEN_DECIMALS},
        DELOBridge: {address: con, decimals: TOKEN_DECIMALS}
      }
    }else{
      var con = this.isBSC ? DELO_BSC_BRIDGE_CONTRACT_ADDRESS_TEST_NET : DELO_ETH_BRIDGE_CONTRACT_ADDRESS_TEST_NET;
      this.symbols = {
        DELO: {address: DELO_CONTRACT_ADDRESS_TEST_NET, decimals: TOKEN_DECIMALS},
        DELOBridge: {address: con, decimals: TOKEN_DECIMALS}
      }
    }

    if (x == false) return;
    this.statsService.walletStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: stats => {
        if (stats != null && stats.walletDELOBalance != null){
          this.user.balance = stats.walletDELOBalance.toString();
          this.walletStats = stats;
          this.isApproved();
          this.loading = false;
        }
      }
    });
  }

  setMax(num){
    this.balanceControl.setValue(parseFloat(num));
    this.amountChanged();
  }

  isMobile(){
    return this.platform.isMobile();
  }

  async bridge(){
    var amount;
    if (this.balanceControl.value >= this.user.balance){
      amount = this.walletStats.walletDELOBalanceRaw;
    }else{
      amount = this.addDecimals(this.balanceControl.value);
    }
    await this.lotteryService.bridgeTokens(this.isBSC==true ? 'BSC' : 'ETH', amount);
  }

  async initialize(){
    await this.lotteryService.bridgeInit(this.isBSC==true ? 'BSC' : 'ETH');
  }

  async setGas(){
    await this.lotteryService.setGasCost(this.isBSC==true ? 'BSC' : 'ETH');
  }

  swapChain(){
    this.lotteryService.requestChain(this.isBSC==true ? 'ETH' : 'BSC');
  }

  amountChanged(){
    this.receivedControl.setValue(this.balanceControl.value);
  }

  async approveToken(){
    this.loading = true;
    await this.lotteryService.enableBridge(this.symbols.DELOBridge.address, (this.walletStats.walletDELOBalanceRaw*2).toString());
    this.isApproved();
  }

  async isApproved(){
    if (!this.walletStats){
      this.approved == false;
      return;
    } 
    this.loading = true;
    var allowance = await this.lotteryService.getAllowanceBridge(this.symbols.DELOBridge.address);
    if (parseFloat(this.walletStats.walletDELOBalanceRaw.toString()) <= parseFloat(allowance.toString())){
      this.approved = true;
    }else{
      this.approved = false;
    }
    this.loading = false;
  }

  canBridge(){
    if (this.balanceControl.value <= 0 || this.balanceControl.invalid || parseFloat(this.reserve) <= this.balanceControl.value || this.approved == false){
      return false;
    }else{
      return true;
    }
  }

  addDecimals(amount){
    return this.strtodec(amount, TOKEN_DECIMALS)
  }

  strtodec(amount,dec){
    var stringf = "";
    for(var i=0;i<dec;i++){
    stringf = stringf+"0";
    }
    return amount+stringf;
  }

}
