import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

import {LotteryService} from '../../services/lottery.service'
import { StatsService } from 'src/app/services/stats.service';
import { DrawModel, State } from '../../models/draw.model';
import { WalletStats } from 'src/app/models/walletstats.model';
import { Detailed} from 'src/app/models/stats-detailed.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MyWinsModalComponent } from '../my-wins-modal/my-wins-modal.component';
import { PreviousWinnersModalComponent } from '../previous-winners-modal/previous-winners-modal.component';

@Component({
  selector: 'app-draw-stats-card',
  templateUrl: './draw-stats-card.component.html',
  styleUrls: ['./draw-stats-card.component.css']
})
export class DrawStatsCardComponent implements OnInit, OnDestroy {
  @Output() update = new EventEmitter<string>();
  @Input() displayDrawStats: Detailed[];
  @Input() displayWalletStats: Detailed[];

  user: any;
  hasRandom: boolean;
  drawState: string;
  loading: boolean = false;
  private ngUnsubscribe = new Subject();

  constructor(private lotteryService: LotteryService, private statsService: StatsService, public dialog: MatDialog) { 
    this.user = {address: '', balance: ''};
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

  @HostListener('document:accountsChanged', ['$event.target'])
  onAccountsChanged(el: any) {
    this.connect();
  }
  
  async connect(){
    this.user.address = await this.lotteryService.connectToMetaMask();
    if (this.user.address != false){
      this.getData();
    }
  }

  async getData(){
    await this.statsService.getData();
    await this.getDrawStats();
    await this.getWalletStats();   
  }

  async getDrawStats(){
    (await this.statsService.getDetailedDrawStats())
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: d => {
        this.displayDrawStats = d;
      }
    });
  }

  async getWalletStats(){
    (await this.statsService.getDetailedWalletStats())
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: d => {
        this.displayWalletStats = d;
      }
    });
  }

  async viewMyWins(){
    this.loading = true;
    var x = await this.statsService.checkWinner(this.user.address, false);
    this.openMyWinsDialog(x[0], x[1], x[2]);
  }

  async viewPreviousWinners(){
    this.loading = true;
    var winners = await this.statsService.viewPreviousWinners();
    this.openPreviousWinnersDialogue(winners[0], winners[1]);
  }

  openPreviousWinnersDialogue(draws, winners){
    this.loading = false;
    this.dialog.open(PreviousWinnersModalComponent, {
      data: {
        draws: draws,
        winners: winners
      }
    });
  }
  
  openMyWinsDialog(winAmount, position, amountUSD) {
    this.loading = false;
    this.dialog.open(MyWinsModalComponent, {
      data: {
        amount: winAmount,
        position: position,
        amountUSD: amountUSD
      }
    });
  }
}
