import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, takeUntil } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { StatsService } from 'src/app/services/stats.service';
import { Summary } from 'src/app/models/stats-summary.model';
import { LotteryService } from '../../services/lottery.service';
import { WinnerModalComponent } from '../../shared/winner-modal/winner-modal/winner-modal.component'
import { LoserModalComponent } from '../../shared/winner-modal/loser-modal/loser-modal.component'

import { Detailed } from 'src/app/models/stats-detailed.model';
import { isMobile } from 'web3modal';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-ethlottery',
  templateUrl: './ethlottery.component.html',
  styleUrls: ['./ethlottery.component.css']
})
export class EthlotteryComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  user: any;
  connectionError: boolean;
  wrongChain: boolean = false;
  miniCardData: Summary[];
  miniCardTopData: Summary[];
  miniCardBottomData: Summary[];
  rowHeight: string;
  loading = true;
  winAmount = "?";
  nums: Array<number> = [25, 76, 48];
  @ViewChild("oneItem") oneItem: any;
  @ViewChildren("count") count: QueryList<any>;

  currentPot = 0;
  nextDraw = 0;
  pollingTimer: any;

  cardLayout = this.breakpointObserver.observe(['(max-width: 1400px)']).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 2,
          miniCard: { cols: 1, rows: 1 },
          buy: { cols: 2, rows: 3 },
          explainer: { cols: 2, rows: 3 }
        };
      }

      return {
        columns: 6,
        miniCard: { cols: 1, rows: 1 },
        buy: { cols: 3, rows: 2 },
        explainer: { cols: 6, rows: 2 }
      };
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private statsService: StatsService,
    private lotteryService: LotteryService,
    private elRef: ElementRef,
    public dialog: MatDialog,
    private http: HttpClient
    ) {
      this.breakpointObserver.observe(['(max-width: 600px)', Breakpoints.Tablet, Breakpoints.Small]).subscribe(result => {
        this.rowHeight = result.matches ? '150px' : '200px';
      });      
    }

  ngOnInit() {
    this.connectionError = true;
    this.user = {address: '', balance: ''};
  } 

  ngAfterViewInit(): void {
    this.connect();
  }

  ngOnDestroy () {
    clearTimeout(this.pollingTimer);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async connect(){
    this.user.address = await this.lotteryService.connectToMetaMask();
    if (this.user.address == false){
      this.connectionError = true;
    }else{
      this.connectionError = false;
      this.loading = false;
      this.getSummary();
    }
  }
  triggerWinner(win){
    var winAmount = win[0];
    var position = win[1];
    var amountUSD = win[2];
    if (winAmount > 0){
      this.openWinnerDialog(winAmount, position, amountUSD);
    }else if (winAmount == 0){
      this.openLoserDialog(winAmount);
    }
  }

  openWinnerDialog(winAmount, position, amountUSD) {
    this.dialog.open(WinnerModalComponent, {
      data: {
        amount: winAmount,
        position: position,
        amountUSD: amountUSD
      }
    });
  }

  openLoserDialog(winAmount) {
    this.dialog.open(LoserModalComponent);
  }

  async getSummary(){
    this.getStats()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: any) => {
      var statusColour = data.state != "Growing Jackpot" ? "warn" : "accent";
      var lock = data.state != "Growing Jackpot" ? "lock" : "lock_open";
      var summaryData = [
        { title: "Current Pot", value: data.currentlyAccrued + ' (ETH)', color: "accent", icon: "local_atm", isCurrency: true },
        { title: "Next Draw At", value: data.lottoDrawAt + ' (ETH)', color: "primary", icon: "casino", isCurrency: false },
        { title: "Status", value: data.state, color: statusColour, icon: lock, isCurrency: false },
        { title: "Prev Winners", value: data.numWinners, color: "accent", icon: "emoji_events", isCurrency: false },
        { title: "Total Won", value: data.totalWon + ' (ETH)', color: "primary", icon: "payments", isCurrency: false },
        { title: "Holders", value: data.holders, color: "primary", icon: "insert_emoticon", isCurrency: false }
      ]
      this.miniCardTopData = [summaryData[0], summaryData[1]];
      this.miniCardBottomData = [summaryData[2], summaryData[3], summaryData[4], summaryData[5]];
      this.miniCardData = [summaryData[0], summaryData[1], summaryData[2], summaryData[3], summaryData[4], summaryData[5]];

      this.pollingTimer = setTimeout(()=>{
          this.getSummary();
      }, 15000);
    });
  }

  mobile(){
    return isMobile();
  }

  getStats() {
    var headerDict = {
      'accept': 'application/json',
    }
    var requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
      params: {
        token: 'DSHIB'
      },
    };
    return this.http.get("https://delo-stats.azurewebsites.net/api/decentratokens-stats?code=1", requestOptions);
  }

  checkWinner(){
    this.loading = true;
    var headerDict = {
      'accept': 'application/json',
    }
    var requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
      params: {
        token: 'DSHIB',
        address: this.user.address
      },
    };
    this.http.get("https://delo-stats.azurewebsites.net/api/decentratokens-checkwinner?code=1", requestOptions)
    .subscribe((data: any) => {
      this.loading = false;
      console.log(data)
      this.winAmount = data.winAmount;
    });
  }
}