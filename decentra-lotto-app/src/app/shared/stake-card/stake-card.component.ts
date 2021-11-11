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
import { StakingStats } from 'src/app/models/stakingstats.model';
import { WalletStats } from 'src/app/models/walletstats.model';
import { LotteryService } from 'src/app/services/lottery.service';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-stake-card',
  templateUrl: './stake-card.component.html',
  styleUrls: ['./stake-card.component.css']
})
export class StakeCardComponent implements OnInit, OnDestroy {

  isChecked = true;
  balanceControl = new FormControl(0, Validators.min(0));
  user:any;
  walletStats: WalletStats;
  tokenBalance: number;
  symbols: any;
  approved:boolean;
  walletStakedRaw: any;
  walletStakedRounded: any;
  walletStakedRoundedNumber: any;
  loading: boolean = true;
  private ngUnsubscribe = new Subject();
  
  constructor(private lotteryService: LotteryService, private statsService: StatsService) {
    this.user = {address: '', truncatedAddress: '', balance: ''};
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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async connect(){
    var x = await this.lotteryService.connectToMetaMask();
    if (x == false) return;
    await this.getData();
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
    this.statsService.stakingStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: stats => {
        if (stats){
          this.walletStakedRaw = stats.yourStakeRaw;
          this.walletStakedRounded = stats.yourStakeRounded.toString();
          this.walletStakedRoundedNumber = stats.yourStakeRounded;
        } 
      }
    });
  }

  async getData(){
    await this.isApproved();
    this.loading = false;
  }

  async approveToken(){
    this.loading = true;
    await this.lotteryService.enableStaking(this.symbols.DELOStaking.address, this.walletStats.walletDELOBalanceRaw);
    this.getData();
  }

  async isApproved(){
    this.loading = true;
    var allowance = await this.lotteryService.getAllowanceStaking(this.symbols.DELOStaking.address);

    if (this.addDecimals(this.balanceControl.value) <= allowance){
      this.approved = true;
    }else{
      this.approved = false;
    }
    this.loading = false;
  }

  async stake(){
    this.loading = true;
    var amount;
    if (this.balanceControl.value >= this.user.balance){
      amount = this.walletStats.walletDELOBalanceRaw;
    }else{
      amount = this.addDecimals(this.balanceControl.value);
    }
    var success = await this.lotteryService.stake(amount);
    if (success != false){
      var round = await this.lotteryService.getStakingRound();
      localStorage.setItem('roundStaked', round);
    }
    this.getData();
  }

  async withdraw(){
    this.loading = true;
    var amount = this.balanceControl.value;
    if (amount == parseFloat(this.walletStakedRounded)){
      amount = this.walletStakedRaw;
    }else{
      amount = this.addDecimals(amount);
    }
    var success = await this.lotteryService.withdrawStake(amount);
    this.getData();
  }

  setMax(num){
    this.balanceControl.setValue(parseFloat(num))
  }

  addDecimals(amount){
    return this.strtodec(Math.floor(amount), TOKEN_DECIMALS)
  }

  strtodec(amount,dec){
    var stringf = "";
    for(var i=0;i<dec;i++){
    stringf = stringf+"0";
    }
    return amount+stringf;
  }

  round(amount){
    return StakingStats.round(amount, TOKEN_DECIMALS, 7).toString();
  }
}
