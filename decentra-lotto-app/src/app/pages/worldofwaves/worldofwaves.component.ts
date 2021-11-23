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

import { WOW_ADDRESS_MAIN_NET } from '../../models/meta-mask.dictionary';

@Component({
  selector: 'app-worldofwaves',
  templateUrl: './worldofwaves.component.html',
  styleUrls: ['./worldofwaves.component.css']
})
export class WorldofwavesComponent implements OnInit {
  wrongChain: boolean = false;
  private ngUnsubscribe = new Subject();
  user: any;
  connectionError: boolean;
  miniCardData: Summary[];
  miniCardTopData: Summary[];
  miniCardBottomData: Summary[];
  displayDrawStats: Detailed[];
  displayWalletStats: Detailed[];
  rowHeight: string;
  nums: Array<number> = [25, 76, 48];
  @ViewChild("oneItem") oneItem: any;
  @ViewChildren("count") count: QueryList<any>;

  charityAddress = WOW_ADDRESS_MAIN_NET;

  cardLayout = this.breakpointObserver.observe(['(max-width: 1400px)']).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 2,
          miniCard: { cols: 1, rows: 1 },
          buy: { cols: 2, rows: 3 },
          explainer: { cols: 2, rows: 4 },
          video: { cols: 2, rows: 3 },
          stats: { cols: 2, rows: 4 },
        };
      }

      return {
        columns: 6,
        miniCard: { cols: 1, rows: 1 },
        buy: { cols: 3, rows: 2 },
        explainer: { cols: 2, rows: 2 },
        video: { cols: 2, rows: 2 },
        stats: { cols: 2, rows: 2 },
      };
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private statsService: StatsService,
    private lotteryService: LotteryService,
    private elRef: ElementRef,
    public dialog: MatDialog,
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async connect(){
    this.user.address = await this.lotteryService.connectToMetaMask();
    if (this.user.address == false){
      this.connectionError = true;
    }else{
      this.connectionError = false;
      if (await this.lotteryService.getChain() != this.lotteryService.options.chainId){
        this.wrongChain = true;
      }else{
        await this.Update();
      }
    }
  }
  
  async Update(){
    if (this.connectionError == true) return;
    await this.statsService.getData();
    this.triggerWinner(await this.statsService.checkWinner(this.user.address));
    await this.getSummary();
    await this.getDrawStats();
    await this.getWalletStats();
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
    this.statsService.drawStatsSub.subscribe({
      next: async stats => {
        (await this.statsService.getSummaryStats())
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: summaryData => {
            this.miniCardTopData = [summaryData[0], summaryData[6]];
            this.miniCardBottomData = [summaryData[1], summaryData[2], summaryData[3], summaryData[4]];
            this.miniCardData = [summaryData[0], summaryData[6], summaryData[1], summaryData[2], summaryData[3], summaryData[4]];
          }
        });
      }
    });
  }

  async getDrawStats(){
    this.statsService.drawStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: async stats => {
        (await this.statsService.getDetailedDrawStats()).subscribe({
          next: d => {
            this.displayDrawStats = d;
          }
        });
      }
    });
  }

  async getWalletStats(){
    this.statsService.walletStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: async stats => {
        (await this.statsService.getDetailedWalletStats()).subscribe({
          next: d => {
            this.displayWalletStats = d;
          }
        });
      }
    });
  }

  mobile(){
    return isMobile();
  }

}
