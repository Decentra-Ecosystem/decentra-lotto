import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  DELO_CONTRACT_ADDRESS_MAIN_NET, 
  DELO_CONTRACT_ADDRESS_TEST_NET, 
  DELOSTAKING_CONTRACT_ADDRESS_MAIN_NET,
  DELOSTAKING_CONTRACT_ADDRESS_TEST_NET,
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

  balanceControl = new FormControl(0, Validators.min(0));
  receivedControl = new FormControl(0, Validators.min(0));
  user:any;
  walletStats: WalletStats;
  symbols: any;
  loading: boolean = true;
  isBSC: boolean = true;
  private ngUnsubscribe = new Subject();

  constructor(private lotteryService: LotteryService, private statsService: StatsService, private platform: PlatformCheckerService,) { 
    this.user = {address: '', truncatedAddress: '', balance: '0', balanceETH: '0'};
    if (IS_LIVE){
      this.symbols = {
        DELO: {address: DELO_CONTRACT_ADDRESS_MAIN_NET, decimals: TOKEN_DECIMALS},
        DELOStaking: {address: DELOSTAKING_CONTRACT_ADDRESS_MAIN_NET, decimals: TOKEN_DECIMALS}
      }
    }else{
      this.symbols = {
        DELO: {address: DELO_CONTRACT_ADDRESS_TEST_NET, decimals: TOKEN_DECIMALS},
        DELOStaking: {address: DELOSTAKING_CONTRACT_ADDRESS_TEST_NET, decimals: TOKEN_DECIMALS}
      }
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.connect();
    this.loading = false;
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
    }else if (chain == 1){
      this.isBSC = false;
    }
    if (x == false) return;
    this.statsService.walletStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: stats => {
        if (stats != null && stats.walletDELOBalance != null){
          this.user.balance = stats.walletDELOBalance.toString();
          this.walletStats = stats;
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

  bridge(){
    
  }

  swapChain(){
    this.lotteryService.requestChain(this.isBSC==true ? 'ETH' : 'BSC');
  }

  amountChanged(){
    this.receivedControl.setValue(this.balanceControl.value);
  }

}
