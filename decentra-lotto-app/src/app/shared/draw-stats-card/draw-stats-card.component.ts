import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

import {LotteryService} from '../../services/lottery.service'
import { StatsService } from 'src/app/services/stats.service';
import { DrawModel, State } from '../../models/draw.model';
import { WalletStats } from 'src/app/models/walletstats.model';
import { Detailed} from 'src/app/models/stats-detailed.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-draw-stats-card',
  templateUrl: './draw-stats-card.component.html',
  styleUrls: ['./draw-stats-card.component.css']
})
export class DrawStatsCardComponent implements OnInit, OnDestroy {
  @Output() update = new EventEmitter<string>();
  @Input() displayDrawStats: Detailed[];
  @Input() displayWalletStats: Detailed[];

  hasRandom: boolean;
  drawState: string;
  private ngUnsubscribe = new Subject();

  constructor(private lotteryService: LotteryService, private statsService: StatsService) { }

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
    var x =await this.lotteryService.connectToMetaMask();
    if (x != false){
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
}
