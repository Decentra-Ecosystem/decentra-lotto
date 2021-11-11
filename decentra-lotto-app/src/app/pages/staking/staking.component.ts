import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, takeUntil } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { StatsService } from 'src/app/services/stats.service';
import { Summary } from 'src/app/models/stats-summary.model';
import { LotteryService } from '../../services/lottery.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css']
})
export class StakingComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  user: any;
  connectionError: boolean;
  miniCardData: Summary[];
  miniCardTopData: Summary[];
  miniCardBottomData: Summary[];
  rowHeight: string;
  nums: Array<number> = [25, 76, 48];
  @ViewChild("oneItem") oneItem: any;
  @ViewChildren("count") count: QueryList<any>;

  cardLayout = this.breakpointObserver.observe(['(max-width: 1400px)']).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 2,
          stakeCard: {cols: 2, rows: 3},
          harvestCard: {cols: 2, rows: 3},
          miniCard: { cols: 1, rows: 1 },
          info: {cols: 2, rows: 2}
        };
      }

      return {
        columns: 6,
        stakeCard: {cols: 3, rows: 2},
        harvestCard: {cols: 3, rows: 2},
        miniCard: { cols: 1, rows: 1 },
        info: {cols: 3, rows: 1}
      };
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private statsService: StatsService,
    private lotteryService: LotteryService,
    private elRef: ElementRef,
    public dialog: MatDialog
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
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async connect(){
    this.user.address = await this.lotteryService.connectToMetaMask();
    if (this.user.address == false){
      this.connectionError = true;
    }else{
      this.connectionError = false;
      await this.Update();
    }
  }
  
  async Update(){
    if (this.connectionError == true) return;
    await this.statsService.getData();
    await this.getStatsSummary();
  }

  async getStatsSummary(){
    this.statsService.stakingStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
        next: async stats => {
          (await this.statsService.getStakingSummaryStats())
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: summaryData => {
              this.miniCardTopData = [summaryData[3], summaryData[4]];
              this.miniCardBottomData = [summaryData[0], summaryData[1], summaryData[2], summaryData[5]];
              this.miniCardData = summaryData;
            }
          });
        }
    });
  }

  mobile(){
    return window.innerWidth < 1400;
  }
}
