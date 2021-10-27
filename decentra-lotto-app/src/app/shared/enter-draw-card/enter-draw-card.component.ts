import { Component, OnInit, Output, EventEmitter, OnDestroy, HostListener, Input } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {LotteryService} from '../../services/lottery.service'
import {UtilsService} from '../../services/utils.service';
import { DrawModel, State } from '../../models/draw.model';
import { WalletStats } from '../../models/walletstats.model';
import { StatsService } from '../../services/stats.service';
import { PlatformCheckerService } from 'src/app/services/platform.service';

import {FormControl, Validators} from '@angular/forms';
import {
  TOKEN_DECIMALS,  
  BNB_DECIMALS
} from '../../models/meta-mask.dictionary';
import { MatDialog } from '@angular/material/dialog';
import { TicketsBoughtModalComponent } from '../tickets-bought-modal/tickets-bought-modal.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GiftModalComponent } from '../gift-modal/gift-modal.component';

@Component({
  selector: 'app-enter-draw-card',
  templateUrl: './enter-draw-card.component.html',
  styleUrls: ['./enter-draw-card.component.css']
})
export class EnterDrawCardComponent implements OnInit, OnDestroy {
  @Input() charity: string;
  @Input() charityAddress: string;
  price: number;
  numTicketsControl = new FormControl(5, Validators.min(1));
  symbolControl = new FormControl('BNB');
  approved: boolean;
  tokenBalance: number;
  discounts: number[];
  hedgeDivisor: number;
  deloReceivedAmount: number;
  usdReceivedAmount: number;
  walletStats: WalletStats;
  drawStats: DrawModel;
  newOdds: number;
  hasRandom: boolean;
  loading: boolean = true;
  private ngUnsubscribe = new Subject();
  giftDialogueRef: any;

  symbols = {
    BNB: {address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', decimals: BNB_DECIMALS},
    BUSD: {address: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7', decimals: BNB_DECIMALS},
    USDT: {address: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684', decimals: BNB_DECIMALS},
    DAI: {address: '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867', decimals: BNB_DECIMALS},
    USDC: {address: '0x9780881Bf45B83Ee028c4c1De7e0C168dF8e9eEF', decimals: BNB_DECIMALS}
  }

  constructor(
    private lotteryService: LotteryService,
    private utilsService: UtilsService,
    private statsService: StatsService,
    private platform: PlatformCheckerService,
    public dialog: MatDialog) 
    { }

  ngOnInit(): void {
    this.newOdds = 0;
  }

  ngAfterViewInit(): void {
    this.connect();
  }

  @HostListener('document:accountsChanged', ['$event.target'])
  onAccountsChanged(el: any) {
    this.connect();
  }

  ngOnDestroy () {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isMobile(){
    return this.platform.isMobile();
  }

  async connect(){
    var x = await this.lotteryService.connectToMetaMask();
    if (x == false) return;

    await this.getData();

    this.statsService.walletStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
        next: stats => {
          this.walletStats = stats;
          this.getBalanceOfToken(this.symbols[this.symbolControl.value]);
          this.getPriceForTickets(this.symbols[this.symbolControl.value], parseInt(this.numTicketsControl.value));
        }
    });

    this.statsService.drawStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: stats => {
        this.drawStats = stats;
      }
    });
  }

  async getData(){
    await this.getBalanceOfToken(this.symbols[this.symbolControl.value]);
    await this.getPriceForTickets(this.symbols[this.symbolControl.value], parseInt(this.numTicketsControl.value));
    this.newOdds = this.statsService.getChance(true, parseInt(this.numTicketsControl.value));
    await this.getHedgeDivisor();
    this.getHasRandom();
    this.loading = false;
  }

  countDecimals(val) {
    if(Math.floor(val.valueOf()) === val.valueOf()) return 0;
    return val.toString().split(".")[1].length || 0; 
  }

  async getHedgeDivisor(){
    this.hedgeDivisor = await this.lotteryService.getHedgeDivisor();
    this.getDeloBack(this.price);
  }

  async getDeloBack(amt: any){
    var x = await this.lotteryService.getPriceForTicketsRaw(this.symbols[this.symbolControl.value], this.numTicketsControl.value);
    var yRounded = 0;
    var yRaw = 0;
    if (this.symbolControl.value == "BNB"){
      var t = await this.lotteryService.getBNBValueInDelo(x);
      yRounded = t[1];
      yRaw = t[0];
    }else{
      var t = await this.lotteryService.getPEGValueInDelo(x);
      yRounded = t[1];
      yRaw = t[0];
    }
    this.deloReceivedAmount = parseFloat((yRounded/this.hedgeDivisor).toFixed(2));
    this.usdReceivedAmount = parseFloat((await this.lotteryService.getDELOValueInPeg(yRaw)/this.hedgeDivisor).toFixed(2));
  }

  async getBalanceOfToken(token: { address: any; decimals: any; }) {
    if (token != this.symbols.BNB){
      this.tokenBalance = WalletStats.round(await this.lotteryService.getBalanceOfToken(token.address), token.decimals, 4);
    }else{
      this.tokenBalance = WalletStats.round(await this.lotteryService.getBNBBalance(), token.decimals, 5);
    }
  }

  selectToken(){
    if (this.numTicketsControl.value % 1 != 0){
      this.numTicketsControl.setValue(Math.round(this.numTicketsControl.value));
    }
    this.tokenBalance = null;
    this.getPriceForTickets(this.symbols[this.symbolControl.value], this.numTicketsControl.value);
    this.isApproved();
    this.getBalanceOfToken(this.symbols[this.symbolControl.value]);
    this.newOdds = this.statsService.getChance(true, parseInt(this.numTicketsControl.value));
  }

  getNow(){
    return new Date();
  }

  deadlinePassed(){
    if (!this.drawStats) return false;
    var x = new Date();
    var r = x.getTime() >= this.drawStats.drawDeadline.getTime();
    return r;
  }

  dateToString(d: { getDate: () => string; getMonth: () => number; getFullYear: () => any; getHours: () => any; getMinutes: () => any; getSeconds: () => any; }){
    return this.utilsService.dateToString(d);
  }

  async getPriceForTickets(token: { address: any; decimals: number; }, num: number) {
    this.price = await this.lotteryService.getPriceForTicketsDecimals(token, num);
    this.price = Math.round((this.price + Number.EPSILON) * 10000) / 10000;
    this.discounts = await this.lotteryService.getDiscountForTickets();
    this.getDeloBack(this.price);
  }

  getDiscount(amt){
    if (!this.discounts) return 0;
    if (amt >= 20){
      return this.discounts[2];
    }else if (amt >= 10){
      return this.discounts[1];
    }else if (amt >= 5){
      return this.discounts[0];
    }else{
      return 0;
    }
  }

  giftTickets(){
    this.giftDialogueRef = this.dialog.open(GiftModalComponent, {
    });

    this.giftDialogueRef.afterClosed().subscribe(res => {
      // received data from dialog-component
      if (res.data != false)
        this.buyTickets(res.data);
    })
  }

  async buyTickets(address:any = null){
    this.loading = true;
    var x = await this.lotteryService.getPriceForTicketsRaw(this.symbols[this.symbolControl.value], this.numTicketsControl.value);
    var success = false;
    console.log(this.charityAddress);
    if (this.symbols[this.symbolControl.value] == this.symbols.BNB){
      success = await this.lotteryService.buyTicketsBNB(this.numTicketsControl.value, x*1.005, address, this.charityAddress); //0.05% extra for slippage
    }else{
      success = await this.lotteryService.buyTicketsStable(this.symbols[this.symbolControl.value].address, this.numTicketsControl.value, address, this.charityAddress);
    }
    if (success != false){
      this.dialog.open(TicketsBoughtModalComponent, {
        data: {
          amount: this.deloReceivedAmount,
          numTickets: this.numTicketsControl.value,
          giftingAddress: address
        }
      });
      this.getData();
    }
    this.loading = false;
  }

  async approveToken(){
    this.loading = true;
    var x = await this.lotteryService.getPriceForTicketsRaw(this.symbols[this.symbolControl.value], this.numTicketsControl.value);
    var success = false;
    success = await this.lotteryService.enableToken(this.symbols[this.symbolControl.value].address, x);
    this.isApproved();
    this.loading = false;
    this.getData();
  }

  async isApproved(){
    var allowance = await this.lotteryService.getAllowance(this.symbols[this.symbolControl.value].address);
    var amount = await this.lotteryService.getPriceForTicketsRaw(this.symbols[this.symbolControl.value], this.numTicketsControl.value);

    if (amount <= allowance){
      this.approved = true;
    }else{
      this.approved = false;
    }
  }

  async getHasRandom(){
    this.hasRandom = await this.lotteryService.hasRandom();
  }

  async endDraw(){
    this.loading = true;
    var success = await this.lotteryService.endDraw();
    this.getData();
  }

  async drawWinners(){
    this.loading = true;
    // var x = await this.statsService.getDrawStats();
    if (this.drawStats.state  == State.Ready){
      var success = await this.lotteryService.drawWinners();
      this.loading = false;
      window.location.reload();
    }
  }

  async setDeadline(){
    await this.lotteryService.setDeadline();
    this.getData();
  }
}
