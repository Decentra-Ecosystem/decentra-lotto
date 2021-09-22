import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TOKEN_DECIMALS } from 'src/app/models/meta-mask.dictionary';
import { StakingStats } from 'src/app/models/stakingstats.model';
import { LotteryService } from 'src/app/services/lottery.service';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-harvest-card',
  templateUrl: './harvest-card.component.html',
  styleUrls: ['./harvest-card.component.css']
})
export class HarvestCardComponent implements OnInit, OnDestroy {

  user:any;
  walletStakedRaw: any;
  walletStakedRounded: any;
  pendingRewardRaw: any;
  pendingRewardRounded: any;
  tvl:any;
  rewardsControl = new FormControl({value: 0, disabled: true}, Validators.min(1));
  round: number;
  roundStaked: number;
  private ngUnsubscribe = new Subject();

  constructor(private statsService: StatsService, private lotteryService: LotteryService) { 
    this.user = {address: '', truncatedAddress: '', balance: ''};
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
        if (stats && stats.walletDELOBalance) this.user.balance = stats.walletDELOBalance;
      }
    });
    this.statsService.stakingStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: async stats => {
        if (stats){
          this.pendingRewardRaw = stats.yourPendingRewardsRaw;
          this.pendingRewardRounded = stats.yourPendingRewardsRounded;
          this.round = stats.round;
          this.roundStaked = parseInt(localStorage.getItem('roundStaked'));
        }
      }
    });
  }

  async getData(){
    this.user.balance = 0;
    this.getStaked();
    this.getStakingTVL();
    this.round = await this.lotteryService.getStakingRound();
    this.roundStaked = parseInt(localStorage.getItem('roundStaked'));
  }

  canWithdraw(){
    if (this.round <= this.roundStaked) return false;
    if (this.pendingRewardRounded <= 0) return false;
    return true;
  }

  async getStaked(){
    this.walletStakedRaw = await this.lotteryService.getStakedRaw();
    this.walletStakedRounded = StakingStats.round(this.walletStakedRaw, TOKEN_DECIMALS, 5);
  }

  async withdrawPendingRewards(){
    var success = await this.lotteryService.withdrawPendingRewards();
    this.getData();
  }

  async getStakingTVL(){
    this.tvl = await this.lotteryService.getStakingTVL();
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

}
