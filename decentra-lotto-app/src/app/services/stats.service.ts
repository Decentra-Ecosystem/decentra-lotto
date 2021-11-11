import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, interval, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Summary } from '../models/stats-summary.model';
import { Detailed } from '../models/stats-detailed.model';
import { LotteryService } from './lottery.service';
import { DrawModel, State } from '../models/draw.model';
import { WalletStats } from '../models/walletstats.model';
import { StakingStats } from '../models/stakingstats.model';
import { isMobile } from 'web3modal';
import { TOKEN_DECIMALS } from '../models/meta-mask.dictionary';

@Injectable({
  providedIn: 'root'
})
export class StatsService implements OnDestroy {

  drawStats: DrawModel;
  walletStats: WalletStats;
  countdown: string;
  stakingStats: StakingStats;
  //totalDonated: any;

  dataSubscription: Subscription;
  pollingTimer: any;
  walletStatsSub: BehaviorSubject<WalletStats>;
  drawStatsSub: BehaviorSubject<DrawModel>;
  stakingStatsSub: BehaviorSubject<StakingStats>;

  public deadlineTimeDifference;
  public deadlineSecondsToDday;
  public deadlineMinutesToDday;
  public deadlineHoursToDday;
  public deadlineDaysToDday;
  public dateNow = new Date();
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  timeLastRefreshed: Date;

  initiated: boolean = false;

  constructor(private lottery: LotteryService) { }

  ngOnDestroy () {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
    if (this.pollingTimer) clearTimeout(this.pollingTimer)
  }

  async init(){
    if (this.initiated == false){
      this.initiated = true;
      if (!this.walletStatsSub){
        this.walletStatsSub = new BehaviorSubject(this.walletStats);
      }
      if (!this.drawStatsSub){
        this.drawStatsSub = new BehaviorSubject(this.drawStats);
      }
      if (!this.stakingStatsSub){
        this.stakingStatsSub = new BehaviorSubject(this.stakingStats);
      }
      this.pollData();
    }
  }

  async pollData(){
    await this.getData();
    this.pollingTimer = setTimeout(()=>{
      this.pollData();
    }, 10000);
  }

  async getData(){
    this.drawStats = new DrawModel(await this.lottery.getDrawStats(null));
    this.walletStats = new WalletStats(await this.lottery.getWalletStats(null));
    this.drawStats.totalPotRaw = await this.lottery.getCurrentPot();
    this.drawStats.totalPot = WalletStats.round(this.drawStats.totalPotRaw, TOKEN_DECIMALS, 5);
    this.walletStats.walletChance = this.getChance(false, 0);
    this.drawStats.oddsPerTicket = parseFloat(((this.drawStats.numWinners/this.drawStats.numTickets)*100).toFixed(2));
    this.drawStats.totalPotUSD = await this.lottery.getDELOValueInPeg(this.drawStats.totalPotRaw);
    
    var x = await this.lottery.getUserBalance();
    this.walletStats.walletDELOBalance = x[0];
    this.walletStats.walletDELOBalanceRaw = x[1];
    this.drawStats.stateString = this.getState(this.drawStats.state);

    await this.getStakingStats();

    if (!this.walletStatsSub){
      this.init();
    }
    this.walletStatsSub.next(this.walletStats);
    this.drawStatsSub.next(this.drawStats);
    this.stakingStatsSub.next(this.stakingStats);

    return (this.drawStats, this.walletStats);
  }

  getChance(calc: boolean, newTickets: number): number{
    if (!this.walletStats) return 0;
    var myTicketsWithNew = calc==true ? newTickets + this.walletStats.numTickets * 1 : this.walletStats.numTickets * 1;
    var otherTickets = this.drawStats.numTickets - this.walletStats.numTickets;
    if (myTicketsWithNew == 0 || otherTickets == 0){
      if (otherTickets == 0){
        if (myTicketsWithNew > 0){
          return 100;
        }
      }
      return 0;
    }
    var numWinners = this.drawStats.numWinners == 0 ? 1 : this.drawStats.numWinners;
    otherTickets = otherTickets / numWinners;
    var pw = (myTicketsWithNew / (myTicketsWithNew + otherTickets))*100;
    return Math.round((pw + Number.EPSILON) * 10000) / 10000;
  }
  
  private getTimeDifference () {
    this.deadlineTimeDifference = this.drawStats.drawDeadline.getTime() - new  Date().getTime();
    this.allocateTimeUnits(this.deadlineTimeDifference);
  }

  private allocateTimeUnits (timeDifference) {
      this.deadlineSecondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
      this.deadlineMinutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
      this.deadlineHoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
      this.deadlineDaysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));

      var totalHours = Math.round(timeDifference / 36e5);
      if (isMobile()){
        if (totalHours < 1){
          this.countdown = this.deadlineMinutesToDday + "mins " + this.deadlineSecondsToDday + "s";
        }else if (totalHours < 24){
          this.countdown = totalHours + "hrs " + this.deadlineMinutesToDday + "mins";
        }
        else{
          this.countdown = totalHours + "hrs";
        }
      }else{
        if (totalHours < 1){
          this.countdown = this.deadlineMinutesToDday + "mins " + this.deadlineSecondsToDday + "s";
        }else if (totalHours < 24){
          this.countdown = totalHours + "hrs " + this.deadlineMinutesToDday + "mins " + this.deadlineSecondsToDday + "s";
        }
        else{
          this.countdown = totalHours + "hrs";
        }
      }
  }

  async viewPreviousWinners(id:number=null){
    var r = [];
    var draws = [];
    if (id == null){
      id = this.drawStats.id-1;
    }

    if(id-1 > 0){
      var prev = new DrawModel(await this.lottery.getDrawStats(id-1));
      draws.push({id: prev.id, date: prev.drawDeadline});
    }

    var draw = new DrawModel(await this.lottery.getDrawStats(id));
    draws.push({id: id, date: draw.drawDeadline});

    if(id+1 < this.drawStats.id){
      var next = new DrawModel(await this.lottery.getDrawStats(id+1));
      draws.push({id: next.id, date: next.drawDeadline});
    }

    for (var i=0; i<draw.winners.length; i++){
      var amt = await this.lottery.getWalletWinAmountForDraw(draw.id, draw.winners[i]);
      var usdAmt = await this.lottery.getDELOValueInPeg(amt[0]);
      var q = {positions: [i+1], address: draw.winners[i], deloAmount: amt[1], usdAmount: usdAmt}
      //add the win if address has more than 1 win
      if (r.filter(e => e.address === draw.winners[i]).length > 0) {
        r.filter(e => e.address === draw.winners[i])[0].positions.push(i+1);
      }

      //push the win if there is no other win for this address
      if (r.filter(e => e.address === draw.winners[i]).length == 0) {
        r.push(q);
      }
    }
    return [draws, r];
  }

  async checkWinner(address, sinceLast=true){
    var last = 0;
    if (sinceLast == true){
      last = this.getLastCheck(address);
    }
    var position = [];

    //start at the last checked draw + 1 (the next unchecked draw)
    var totalWinnings = -1;
    var totalWinningsUSD = -1;
    if (last+1 < this.drawStats.id){
      for (var i=last+1; i<this.drawStats.id; i++){
        var draw = new DrawModel(await this.lottery.getDrawStats(i));
        var wallet = new WalletStats(await this.lottery.getWalletStats(i));
        if (wallet.numTickets > 0 && totalWinnings == -1){
          totalWinnings = 0;
          totalWinningsUSD = 0;
        }
        if (draw.winners.includes(address) == true){
          if (totalWinnings == -1) totalWinnings = 0;
          var positions = '';
          for(var q=0; q < draw.winners.length; q++){
            if (draw.winners[q] == address){
              var h = q+1;
              if (q == 0){
                positions = h+'';
              }else{
                positions += ', '+h;
              }
            }
          }
          var amt = await this.lottery.getWalletWinAmountForDraw(draw.id, address);
          var usdAmt = await this.lottery.getDELOValueInPeg(amt[0]);

          var x = {id: 0, position: '', amount: 0, amountUSD: 0};
          x.id = draw.id;
          x.position = positions;
          x.amount = amt[1];
          x.amountUSD = usdAmt;
          position.push(x);

          totalWinningsUSD += usdAmt
          totalWinnings += amt[1];
        }
      }
    }

    totalWinningsUSD = parseFloat(totalWinningsUSD.toFixed(2));
    if (sinceLast == true) this.setCheck(address, this.drawStats.id-1);
    return [totalWinnings, position, totalWinningsUSD];
  }

  getLastCheck(address){
      var x = JSON.parse(localStorage.getItem('lastCheck'));
      var returnIndex = -1;
      if (x){
        for (var i=0; i<x.length; i++){
          if (x[i].address == address){
            return parseInt(x[i].lastCheckId);
          }
        }
      }
      return 0;
  }

  setCheck(address, id){
      var p = JSON.parse(localStorage.getItem('lastCheck'));
      if (p != null && p!= undefined){
        var updated = false;
        for(var i=0; i<p.length; i++){
          if (p[i].address == address){
            p[i].lastCheckId = id;
            updated = true;
            localStorage.setItem('lastCheck', JSON.stringify(p));
          }
        }
        if (updated == false){
          p.push({'address': address, 'lastCheckId': id})
        }
        localStorage.setItem('lastCheck', JSON.stringify(p));
      }else{
        var x = [{'address': address, 'lastCheckId': id}];
        localStorage.setItem('lastCheck', JSON.stringify(x));
      }      
  }

  async getDrawStats(): Promise<Observable<DrawModel>> {   
    await this.getData(); 
    return of(
      {
        id: this.drawStats.id,
        numParticipants: this.drawStats.numParticipants,
        tickets: this.drawStats.tickets,
        winners: this.drawStats.winners,
        numTickets: this.drawStats.numTickets,
        totalSpend: this.drawStats.totalSpend,
        createdOn: this.drawStats.createdOn,
        drawDeadline: this.drawStats.drawDeadline,
        totalPot: this.drawStats.totalPot,
        state: this.drawStats.state,
        numWinners: this.drawStats.numWinners,
        stateString: this.drawStats.stateString,
        oddsPerTicket: this.drawStats.oddsPerTicket,
        totalPotRaw: this.drawStats.totalPotRaw,
        totalPotUSD: this.drawStats.totalPotUSD
      }
    );
  }

  async getWalletStats(): Promise<Observable<WalletStats>> {  
    await this.getData(); 
    return of(
      {
        walletDrawSpendBNB: this.walletStats.walletDrawSpendBNB,
        numTickets: this.walletStats.numTickets,
        walletCharityTickets: this.walletStats.walletCharityTickets,
        walletTotalSpendBNB: this.walletStats.walletTotalSpendBNB,
        walletTotalTicketsPurchased: this.walletStats.walletTotalTicketsPurchased,
        walletTotalWins: this.walletStats.walletTotalWins,
        walletTotalWinValueLep: this.walletStats.walletTotalWinValueLep,
        walletChance: this.walletStats.walletChance,
        walletDELOBalance: this.walletStats.walletDELOBalance,
        walletDELOBalanceRaw: this.walletStats.walletDELOBalanceRaw,
        stakingStats: this.walletStats.stakingStats,
        walletTotalCharityTickets: this.walletStats.walletTotalCharityTickets,
        totalAirdropsReceived: this.walletStats.totalAirdropsReceived
      }
    );
  }

  async getStakingStats(){
    var tvl = await this.lottery.getStakingTVL();
    var tvlUSD = await this.lottery.getDELOValueInPeg(tvl[0]);
    var withdrawalFee = 2;
    // var totalDividends = await this.lottery.getTotalDividends();
    var yourStake = await this.lottery.getStakedRaw();
    var yourPendingRewards = await this.lottery.getPendingReward();
    var round = await this.lottery.getStakingRound();
    this.stakingStats = new StakingStats([tvlUSD, withdrawalFee, "Variable", yourStake, yourPendingRewards, round]);
    return this.stakingStats;
  }

  async getSummaryStats(): Promise<Observable<Summary[]>> {
    this.getTimeDifference();

    var status = this.getState(this.drawStats.state);
    var statusColour = status != "Open" || this.drawStats.drawDeadline <= new Date() ? "warn" : "accent";
    var lock = status != "Open" || this.drawStats.drawDeadline <= new Date() ? "lock" : "lock_open";
    var statusText = status == "Open" && this.drawStats.drawDeadline <= new Date() ? "Deadline Passed" : status;
    var totalDonated = await this.lottery.getTotalDonated('0xc44ff08425375097e4337b48151499280c25268c');
    var totalDonatedUSD = await this.lottery.getDELOValueInPeg(totalDonated);
    totalDonated = WalletStats.round(totalDonated, TOKEN_DECIMALS, 4);

    return of([
      { title: "Total Pot", value: Math.round(this.drawStats.totalPot).toString() + ' ($' + this.drawStats.totalPotUSD.toString() + ')', color: "accent", icon: "local_atm", isCurrency: true },
      { title: "Draw Deadline", value: this.countdown, color: "warn", icon: "timer", isCurrency: false },
      { title: "Odds Per Ticket", value: this.drawStats.oddsPerTicket.toString()+"%", color: "primary", icon: "casino", isCurrency: false },
      { title: "Winning Tickets", value: this.drawStats.numWinners, color: "accent", icon: "emoji_events", isCurrency: false },
      { title: "Tickets Entered", value: this.drawStats.numTickets, color: "primary", icon: "payments", isCurrency: false },
      { title: "Status", value: statusText, color: statusColour, icon: lock, isCurrency: false },
      { title: "Total Donated", value:  totalDonated.toString() + ' ($' + totalDonatedUSD.toString() + ')', color: "accent", icon: "sentiment_very_satisfied", isCurrency: false }
    ]);
  }

  async getDetailedDrawStats(): Promise<Observable<Detailed[]>> {   
    return of([
      { title: "Tickets Entered", value: this.walletStats.numTickets.toString(), color: "accent", icon: "local_atm", isCurrency: false },
      { title: "Winning Chance", value: this.walletStats.walletChance.toString() + '%', color: "warn", icon: "shopping_cart", isCurrency: false },
      { title: "Total BNB Spent", value: this.walletStats.walletDrawSpendBNB.toString(), color: "primary", icon: "payments", isCurrency: false }
    ]);
  }

  async getDetailedWalletStats(): Promise<Observable<Detailed[]>> {   
    return of([
      { title: "Tickets Purchased", value: this.walletStats.walletTotalTicketsPurchased.toString(), color: "warn", icon: "portrait", isCurrency: false },
      { title: "Your Wins", value: this.walletStats.walletTotalWins.toString(), color: "accent", icon: "portrait", isCurrency: false },
      { title: "Win Amount", value: this.walletStats.walletTotalWinValueLep.toString() + " DELO", color: "primary", icon: "portrait", isCurrency: false }
    ]);
  }

  async getStakingSummaryStats(): Promise<Observable<Detailed[]>> {   
    return of([
      { title: "Total Value Locked", value: '$' + this.stakingStats.tvl.toString(), color: "accent", icon: "local_atm", isCurrency: false },
      { title: "Withdrawal Fee", value: this.stakingStats.withdrawalFee + '%', color: "warn", icon: "lock_open", isCurrency: false },
      { title: "APR", value: this.stakingStats.apr, color: "primary", icon: "paid", isCurrency: false },
      { title: "Your Stake", value: this.stakingStats.yourStakeRounded.toString(), color: "warn", icon: "account_balance", isCurrency: false },
      { title: "Pending Reward", value: this.stakingStats.yourPendingRewardsRounded.toString(), color: "accent", icon: "redeem", isCurrency: false },
      { title: "Round", value: this.stakingStats.round.toString(), color: "primary", icon: "sync", isCurrency: false }
    ]);
  }

  getState(_state: number){
    if (_state == 0){
      return 'Open';
    }else if (_state == 1){
      return 'Closed';
    }else if (_state == 2){
      return 'Ready';
    }else if (_state == 3){
      return 'Finished';
    }
    return '';
  }
  
  getStateString(_state){
    if (_state === State.Open){
      return 'Open';
    }else if (_state === State.Closed){
      return 'Closed';
    }else if (_state === State.Ready){
      return 'Ready';
    }else if (_state === State.Finished){
      return 'Finished';
    }
    return '';
  }
}